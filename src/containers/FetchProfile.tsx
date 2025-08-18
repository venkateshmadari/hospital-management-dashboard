import { useState } from "react";
import SingleBreadcrumbs from "@/components/Breadcrumbs/SingleBreadcrumbs";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { capitalizeFirstLetter } from "@/lib/capitalizeFirstLetter";
import { Pencil } from "lucide-react";
import AddImageModal from "@/components/modals/AddImageModal";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCamelCase } from "@/lib/formatCamelCase";
import formatDate from "@/lib/formatDate";
import DoctorAvailbility from "@/components/doctorComponents/DoctorAvailbility";
import { Button } from "@/components/ui/button";
import { MdEdit } from "react-icons/md";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import InlineLoader from "@/components/loaders/InlineLoader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { specialities } from "@/pages/auth/RegisterPage";
import AddAvailabilityModal from "@/components/modals/AddAvailabilityModal";
import axiosInstance from "@/instance/instance";
import EditAvailabilityModal from "@/components/modals/EditAvailabilityModal";
import DeleteAvailabilityModal from "@/components/modals/DeleteAvailabilityModal";

type ProfileFormValues = {
  name: string;
  email: string;
  designation: string;
  speciality: string;
  description?: string;
};

const FetchProfile = () => {
  const endPoint = import.meta.env.VITE_PUBLIC_IMAGE_URL;
  const { user, setUser, updateProfileImage, updatedProfileData } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState<{
    profile: boolean;
    info: boolean;
    addAvalibility: boolean;
    editAvalibility: boolean;
    deleteAvalibility: boolean;
  }>({
    profile: false,
    info: false,
    addAvalibility: false,
    editAvalibility: false,
    deleteAvalibility: false,
  });
  const [toggleModal, setToggleModal] = useState<{
    profile: boolean;
    addAvalibility: boolean;
    editAvalibility: boolean;
    deleteAvalibility: boolean;
  }>({
    profile: false,
    addAvalibility: false,
    editAvalibility: false,
    deleteAvalibility: false,
  });
  const [isError, setIsError] = useState<{
    add: string | null;
    edit: string | null;
    delete: string | null;
  }>({
    add: null,
    edit: null,
    delete: null,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      designation: user?.designation || "",
      speciality: user?.speciality || "",
      description: user?.description || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading((prev) => ({
      ...prev,
      info: true,
    }));
    try {
      await updatedProfileData({
        name: data.name,
        designation: data.designation,
        speciality: data.speciality,
        description: data.description,
      });
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error || "Failed to update profile");
    } finally {
      setIsLoading((prev) => ({
        ...prev,
        info: false,
      }));
    }
  };

  const handleImageUpload = async (file: File) => {
    // setUploadLoading(true);
    setIsLoading((prev) => ({
      ...prev,
      profile: true,
    }));
    try {
      const res = await updateProfileImage(file);
      toast.success(res.data.message);
    } catch (error: any) {
      console.error("Error updating profile image:", error);
      toast.error(error);
    } finally {
      setIsLoading((prev) => ({
        ...prev,
        profile: false,
      }));
    }
  };

  if (isLoading.profile) {
    toast.loading("Profile uploading");
  }

  const handleAddAvailability = async (data: any) => {
    console.log(data, "dadtaggtatata");
    setIsError((prev) => ({
      ...prev,
      add: null,
    }));
    setIsLoading((prev) => ({
      ...prev,
      addAvalibility: true,
    }));
    try {
      const response = await axiosInstance.post(`/admin/doctors/availability`, {
        doctorId: user?.id,
        availabilites: data,
      });
      if (response?.status === 201) {
        setToggleModal((prev) => ({
          ...prev,
          addAvalibility: false,
        }));
        toast.success(response?.data?.message);
        const newAvailabilities = response.data.data;
        setUser((prev: any) => ({
          ...prev,
          Avability: [...(prev.Avability || []), ...newAvailabilities],
        }));
      }
      console.log(response, "ressssssssssss");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;
      console.log(error, errorMessage);
      toast.error(errorMessage);
      setIsError((prev) => ({
        ...prev,
        add: errorMessage,
      }));
    } finally {
      setIsLoading((prev) => ({
        ...prev,
        addAvalibility: false,
      }));
    }
  };

  const handleEditChanges = async (data: any) => {
    setIsError((prev) => ({
      ...prev,
      edit: null,
    }));
    setIsLoading((prev) => ({
      ...prev,
      editAvalibility: true,
    }));
    const availabilityId = user?.Avability?.find((a) => a.day === data.day)?.id;

    if (!availabilityId) {
      return;
    }
    try {
      const response = await axiosInstance.put(
        `/admin/doctors/availability/${availabilityId}`,
        { ...data, id: availabilityId }
      );
      if (response.status === 200) {
        setUser((prev: any) => ({
          ...prev,
          Avability: prev.Avability.map((a: any) =>
            a.day === data.day ? { ...a, ...data } : a
          ),
        }));
        setToggleModal((prev) => ({
          ...prev,
          editAvalibility: false,
        }));

        toast.success(response.data.message);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;
      console.log(error);
      toast.error(errorMessage);
      setIsError((prev) => ({
        ...prev,
        edit: errorMessage,
      }));
    } finally {
      setIsLoading((prev) => ({
        ...prev,
        editAvalibility: false,
      }));
    }
  };

  const confirmDeleteAvabilities = async (ids: string[]) => {
    setIsError((prev) => ({
      ...prev,
      delete: null,
    }));
    setIsLoading((prev) => ({
      ...prev,
      deleteAvalibility: true,
    }));

    try {
      const response = await axiosInstance.delete(
        "/admin/doctors/availability",
        {
          data: { availabilityIds: ids },
        }
      );

      if (response.status === 200) {
        setUser((prev: any) => ({
          ...prev,
          Avability: prev.Avability.filter((a: any) => !ids.includes(a.id)),
        }));

        toast.success(response.data.message);
        setToggleModal((prev) => ({
          ...prev,
          deleteAvalibility: false,
        }));
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;
      toast.error(errorMessage);
      setIsError((prev) => ({
        ...prev,
        delete: errorMessage,
      }));
    } finally {
      setIsLoading((prev) => ({
        ...prev,
        deleteAvalibility: false,
      }));
    }
  };

  const handleOpenAddProfile = () => {
    setToggleModal((prev) => ({
      ...prev,
      profile: true,
    }));
  };

  return (
    <div>
      <SingleBreadcrumbs name="Profile" />
      <div className="flex items-center gap-4 py-3 relative">
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleOpenAddProfile}
        >
          <Avatar className="h-28 w-28 cursor-pointer">
            <AvatarImage
              src={`${endPoint}${user?.image}`}
              alt={user?.name}
              className="object-cover"
            />
            <AvatarFallback className="text-3xl select-none uppercase dark:bg-primary/20 bg-primary/5 border border-primary text-title">
              {user?.name?.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          {isHovered && (
            <div className="absolute bottom-0 right-0 bg-background p-2 rounded-full shadow-md cursor-pointer">
              <Pencil className="h-4 w-4" />
            </div>
          )}
        </div>
        <div className="overflow-hidden inline-flex items-center justify-between w-full">
          <div className="">
            <h1 className="capitalize text-2xl truncate">
              {capitalizeFirstLetter(user?.name)}
            </h1>
            <p className="text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
      </div>
      <div className={`grid lg:grid-cols-3 mt-5 gap-5`}>
        <Card
          className={`dark:bg-black ${
            user?.role === "ADMIN" ? "col-span-3" : "lg:grid-cols-3"
          } bg-white rounded-3xl`}
        >
          <CardHeader className="flex items-center justify-between">
            <h1 className="text-xl text-title select-none">
              Personal Information
            </h1>
            <Button
              className="rounded-full cursor-pointer text-white"
              variant={isEditing ? "default" : "outline"}
              size={isEditing ? "default" : "icon"}
              onClick={() => {
                if (isEditing) {
                  handleSubmit(onSubmit)();
                } else {
                  setIsEditing(true);
                }
              }}
            >
              {isEditing ? (
                isLoading.info ? (
                  <InlineLoader />
                ) : (
                  "Confirm"
                )
              ) : (
                <MdEdit />
              )}
            </Button>
          </CardHeader>

          <CardContent
            className={`${
              user?.role === "ADMIN" ? "grid lg:grid-cols-3 gap-3" : "space-y-3"
            }`}
          >
            {/* Name */}
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              {isEditing ? (
                <Input
                  {...register("name", { required: "Name is required" })}
                  className="w-full bg-transparent border-b border-muted-foreground outline-none"
                />
              ) : (
                <p className="truncate">{capitalizeFirstLetter(user?.name)}</p>
              )}
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name.message}</p>
              )}
            </div>

            {/* Email - Readonly */}
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              {isEditing ? (
                <Input
                  {...register("email")}
                  readOnly
                  className="w-full bg-transparent border-b border-muted-foreground outline-none"
                />
              ) : (
                <p className="truncate">{user?.email}</p>
              )}
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Designation</p>
              {isEditing ? (
                <Input
                  {...register("designation", {
                    maxLength: {
                      value: 25,
                      message: "Maximum length is 25 characters",
                    },
                  })}
                  className="w-full bg-transparent border-b border-muted-foreground outline-none"
                />
              ) : (
                <p className="capitalize">{user?.designation || "-"}</p>
              )}
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Speciality</p>
              {isEditing ? (
                <Select
                  defaultValue={user?.speciality || ""}
                  onValueChange={(value) =>
                    setValue("speciality", value, { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="w-full bg-transparent border-b border-muted-foreground outline-none">
                    <SelectValue placeholder="Select your speciality" />
                  </SelectTrigger>
                  <SelectContent className="w-full cursor-pointer">
                    {specialities.map(({ value, label }) => (
                      <SelectItem
                        key={value}
                        value={value}
                        className="w-full cursor-pointer"
                      >
                        {formatCamelCase(label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="truncate capitalize">
                  {formatCamelCase(user?.speciality || "-")}
                </p>
              )}
            </div>

            {/* Description */}

            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              {isEditing ? (
                <Input
                  {...register("description")}
                  className="w-full bg-transparent border-b border-muted-foreground outline-none"
                />
              ) : (
                <p className="capitalize">{user?.description || "-"}</p>
              )}
            </div>

            {/* Working Since */}
            <div>
              <p className="text-sm text-muted-foreground">Working since</p>
              <p className="truncate capitalize">
                {formatDate(user?.createdAt)}
              </p>
            </div>
          </CardContent>
        </Card>
        {user?.role !== "ADMIN" && (
          <div className="col-span-2 h-full ">
            <DoctorAvailbility
              data={user?.Avability ?? []}
              heading="Your avabilities"
              handleAddAvalibility={() =>
                setToggleModal((prev) => ({
                  ...prev,
                  addAvalibility: true,
                }))
              }
              handleEditAvalibility={() =>
                setToggleModal((prev) => ({
                  ...prev,
                  editAvalibility: true,
                }))
              }
              handleDeleteAvalibility={() =>
                setToggleModal((prev) => ({
                  ...prev,
                  deleteAvalibility: true,
                }))
              }
              subheading="Detailed view of your shifts with timing"
            />
          </div>
        )}
      </div>
      <AddImageModal
        open={toggleModal.profile}
        onOpenChange={(value) =>
          setToggleModal((prev) => ({
            ...prev,
            profile: value,
          }))
        }
        onImageUpload={handleImageUpload}
      />
      <AddAvailabilityModal
        open={toggleModal.addAvalibility}
        onClose={() =>
          setToggleModal((prev) => ({
            ...prev,
            addAvalibility: false,
          }))
        }
        onSubmitAvailability={handleAddAvailability}
        loading={isLoading.addAvalibility}
        error={isError.add}
      />
      <EditAvailabilityModal
        open={toggleModal.editAvalibility}
        onClose={() =>
          setToggleModal((prev) => ({
            ...prev,
            editAvalibility: false,
          }))
        }
        availabilities={user?.Avability || []}
        handleConfirmEdit={handleEditChanges}
        loading={isLoading.editAvalibility}
        error={isError.edit}
      />
      <DeleteAvailabilityModal
        open={toggleModal.deleteAvalibility}
        onClose={() =>
          setToggleModal((prev) => ({
            ...prev,
            deleteAvalibility: false,
          }))
        }
        availabilities={user?.Avability || []}
        handleDelete={confirmDeleteAvabilities}
        loading={isLoading.deleteAvalibility}
        error={isError.delete}
      />
    </div>
  );
};

export default FetchProfile;
