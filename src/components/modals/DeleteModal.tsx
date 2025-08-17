"use client";

import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ErrorBlock from "../ErrorBlock";

type ConfirmDeleteModalProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
  error?: string | null;
  DeleteLoading: boolean | any;
};

const AnimatedTrashIcon = ({ isDeleting }: { isDeleting: boolean }) => {
  return (
    <div className="relative h-12 w-12 flex items-center justify-center">
      {/* Trash Can Body */}
      <motion.div
        className="absolute"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "backOut" }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          className="text-white dark:text-red-500"
        >
          {/* Trash body */}
          <motion.path
            d="M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity="0.3"
            animate={isDeleting ? { scale: [1, 1.05, 1] } : {}}
            transition={{
              duration: 0.6,
              repeat: isDeleting ? Number.POSITIVE_INFINITY : 0,
            }}
          />

          {/* Trash lid */}
          <motion.path
            d="M4 7h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            animate={
              isDeleting
                ? {
                    y: [-2, -8, -2],
                    rotate: [0, -8, 8, 0],
                  }
                : {}
            }
            transition={{
              duration: 1.2,
              repeat: isDeleting ? Number.POSITIVE_INFINITY : 0,
              ease: "easeInOut",
            }}
          />

          {/* Handle */}
          <motion.path
            d="M10 3v4M14 3v4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            animate={isDeleting ? { y: [-2, -8, -2] } : {}}
            transition={{
              duration: 1.2,
              repeat: isDeleting ? Number.POSITIVE_INFINITY : 0,
              ease: "easeInOut",
            }}
          />

          {/* Vertical lines inside trash */}
          <motion.path
            d="M10 11v6M14 11v6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={isDeleting ? { opacity: [1, 0.3, 1] } : {}}
            transition={{
              duration: 0.8,
              repeat: isDeleting ? Number.POSITIVE_INFINITY : 0,
              ease: "easeInOut",
            }}
          />
        </svg>
      </motion.div>

      {/* Animated particles going into trash when deleting */}
      <AnimatePresence>
        {isDeleting && (
          <>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-red-400 rounded-full"
                initial={{
                  x: Math.random() * 30 - 15,
                  y: -15,
                  opacity: 1,
                  scale: 1,
                }}
                animate={{
                  x: 0,
                  y: 12,
                  opacity: 0,
                  scale: 0.5,
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeIn",
                }}
                style={{
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
            ))}

            {/* Data lines going into trash */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`line-${i}`}
                className="absolute w-4 h-0.5 bg-blue-400 rounded-full"
                initial={{
                  x: i % 2 === 0 ? -20 : 20,
                  y: -8,
                  opacity: 1,
                  rotate: i % 2 === 0 ? -45 : 45,
                }}
                animate={{
                  x: 0,
                  y: 10,
                  opacity: 0,
                  rotate: 0,
                  scale: 0.3,
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.3,
                  repeat: isDeleting ? Number.POSITIVE_INFINITY : 0,
                  ease: "easeInOut",
                }}
                style={{
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const DeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  error,
  DeleteLoading,
}) => {
  if (!open) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] rounded-3xl">
        <DialogHeader className="flex flex-col items-center">
          <motion.div
            className="h-16 w-16 rounded-full flex items-center justify-center bg-rose-600 dark:bg-rose-600/50 mx-auto"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 0.5,
              ease: "backOut",
              delay: 0.1,
            }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
          >
            <AnimatedTrashIcon isDeleting={DeleteLoading} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <DialogTitle>Are you absolutely sure?</DialogTitle>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <DialogDescription>This action cannot be undone</DialogDescription>
          </motion.div>
        </DialogHeader>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="py-1 text-red-600"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="flex justify-end space-x-2 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Cancel
          </Button>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={DeleteLoading}
              className="cursor-pointer"
            >
              {DeleteLoading ? (
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Deleting...</span>
                </motion.div>
              ) : (
                "Delete"
              )}
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
