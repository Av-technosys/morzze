"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteFaq } from "@/helper/faq/action";

export function FaqDeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const res = await deleteFaq(id);
      if (res.success) {
        toast.success(res.message ?? "FAQ deleted successfully");
        router.refresh();
      } else {
        toast.error(res.message ?? "Failed to delete FAQ");
      }
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 border-red-200 hover:bg-red-50 text-red-600"
          disabled={isPending}
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this FAQ?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove the FAQ. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            onClick={() => handleDelete()}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
