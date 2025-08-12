import { useState } from "react";
import SingleBreadcrumbs from "@/components/Breadcrumbs/SingleBreadcrumbs";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { capitalizeFirstLetter } from "@/lib/capitalizeFirstLetter";
import { Pencil } from "lucide-react";
import AddImageModal from "@/components/modals/AddImageModal";
import toast from "react-hot-toast";

const FetchProfile = () => {
  const { user, updateProfileImage } = useAuth();
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  const endPoint = import.meta.env.VITE_PUBLIC_IMAGE_URL;
  return (
    <div>
      <SingleBreadcrumbs name="Profile" />
      <div className="flex items-center gap-4 relative">
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

      <AddImageModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onImageUpload={handleImageUpload}
      />
    </div>
  );
};

export default FetchProfile;
