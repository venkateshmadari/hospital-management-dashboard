import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const SignOutModal = ({ open, onOpenChange }: any) => {
  const { logout } = useAuth();

  const handleSignOut = () => {
    onOpenChange(false);
    logout();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg dark:bg-black border min-w-40 bg-white p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="font-medium">
            Do you want to log out?
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="mt-5 flex items-center justify-center w-full gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSignOut}
            variant="destructive"
            className="cursor-pointer"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignOutModal;
