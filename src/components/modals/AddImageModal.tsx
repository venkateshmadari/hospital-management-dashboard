"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const MAX_FILE_SIZE = 1 * 1024 * 1024;

const formSchema = z.object({
  picture: z
    .any()
    .refine((files) => files.length > 0, {
      message: "At least one file is required.",
    })
    .refine(
      (files) =>
        Array.from(files).every((file: any) => file.size <= MAX_FILE_SIZE),
      {
        message: "File size should be less than 1 MB only",
      }
    ),
});

interface AddImageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageUpload: (file: File) => void;
}

type FormData = {
  picture: FileList;
};

const AddImageModal: React.FC<AddImageModalProps> = ({
  open,
  onOpenChange,
  onImageUpload,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const file = data.picture[0];
    console.log(file);
    onImageUpload(file);
    onOpenChange(false);
    console.log(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-lg max-w-[85%]">
        <DialogHeader>
          <DialogTitle>Add Image</DialogTitle>
          <DialogDescription>Upload your personalized image</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
          <div className="grid w-full max-w-full items-center gap-1.5">
            <Label htmlFor="picture" className="mb-3">
              Upload Image
            </Label>
            <Input
              id="picture"
              type="file"
              {...register("picture")}
              accept="image/*"
              className="cursor-pointer"
            />
            {errors.picture && (
              <p className="text-red-500 text-sm">{errors.picture.message}</p>
            )}
          </div>
          <DialogFooter className="mt-5 gap-3 flex flex-row items-end justify-end">
            <Button
              variant={"outline"}
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" className="text-white cursor-pointer">
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddImageModal;
