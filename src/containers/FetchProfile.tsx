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

type ProfileFormValues = {
  name: string;
  email: string;
  designation: string;
  speciality: string;
  description?: string;
};

const FetchProfile = () => {
  const endPoint = import.meta.env.VITE_PUBLIC_IMAGE_URL;
  const { user, updateProfileImage, updatedProfileData } = useAuth();
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
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
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploadLoading(true);
    try {
      const res = await updateProfileImage(file);
      toast.success(res.data.message);
    } catch (error: any) {
      console.error("Error updating profile image:", error);
      toast.error(error);
    } finally {
      setUploadLoading(false);
    }
  };

  if (uploadLoading) {
    toast.loading("Profile uploading");
  }

  console.log(user);
  return (
    <div>
      <SingleBreadcrumbs name="Profile" />
      <div className="flex items-center gap-4 py-3 relative">
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsModalOpen(true)}
        >
          <Avatar className="h-28 w-28 cursor-pointer">
            <AvatarImage
              src={`${endPoint}${user?.image}`}
              alt={user?.name}
              className="object-cover"
            />
            <AvatarFallback className="text-3xl select-none">
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
      <div className="grid lg:grid-cols-3 mt-5 gap-5">
        <Card className="dark:bg-black bg-white rounded-3xl">
          <CardHeader className="flex items-center justify-between">
            <h1 className="text-xl text-title">Personal Information</h1>
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
              {isEditing ? "Confirm" : <MdEdit />}
            </Button>
          </CardHeader>

          <CardContent className="space-y-2.5">
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

            {/* Designation */}
            <div>
              <p className="text-sm text-muted-foreground">Designation</p>
              {isEditing ? (
                <Input
                  {...register("designation")}
                  className="w-full bg-transparent border-b border-muted-foreground outline-none"
                />
              ) : (
                <p className="truncate capitalize">{user?.designation}</p>
              )}
            </div>

            {/* Speciality */}
            <div>
              <p className="text-sm text-muted-foreground">Speciality</p>
              {isEditing ? (
                <Input
                  {...register("speciality")}
                  className="w-full bg-transparent border-b border-muted-foreground outline-none"
                />
              ) : (
                <p className="truncate capitalize">
                  {formatCamelCase(user?.speciality)}
                </p>
              )}
            </div>

            {/* Description */}
            {user?.description && (
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                {isEditing ? (
                  <Input
                    {...register("description")}
                    className="w-full bg-transparent border-b border-muted-foreground outline-none"
                  />
                ) : (
                  <p className="truncate capitalize">
                    {formatCamelCase(user?.description)}
                  </p>
                )}
              </div>
            )}

            {/* Working Since */}
            <div>
              <p className="text-sm text-muted-foreground">Working since</p>
              <p className="truncate capitalize">
                {formatDate(user?.createdAt)}
              </p>
            </div>
          </CardContent>
        </Card>
        <div className="col-span-2 h-full">
          <DoctorAvailbility
            data={user?.Avability ?? []}
            heading="Your avabilities"
            subheading="Detailed view of your shifts with timing"
          />
        </div>
      </div>
      <AddImageModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onImageUpload={handleImageUpload}
      />
    </div>
  );
};

export default FetchProfile;
