import React from "react";
import { getVideos, deleteVideo } from "@/helper/videos/action";
import { Button } from "@/components/ui/button";
import Link from "@/hooks/appLink"
import { PlusCircle, Video, Pencil } from "lucide-react";
import { revalidatePath } from "next/cache";
import DeleteVideoButton from "@/components/admin/DeleteVideoButton";
import { Metadata } from "next";




export const metadata: Metadata = {
  title: `Experience Morzze in Motion with Creative Videos | Morzze`,
  description: `Discover our latest innovations and designs. Explore the world of Morzze through captivating videos that showcase our premium products & elegant solutions.`,
}



async function Page() {
  const allVideos = await getVideos();

  async function deleteAction(id: string) {
    "use server";

    const res = await deleteVideo(id);

    if (res.success) {
      revalidatePath("/admin/videos");
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Video className="w-6 h-6 text-[#2D5A5D]" />
          Manage Videos
        </h1>

        <Link href="/admin/videos/new">
          <Button >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add New Video
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {allVideos.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-xl text-gray-400">
            No videos found. Add your first video!
          </div>
        ) : (
          allVideos.map((video) => (
            <div
              key={video.id}
              className="bg-white p-4 rounded-lg border shadow-sm flex justify-between items-center hover:shadow-md transition"
            >
              <div>
                <h3 className="font-semibold text-lg">{video.title}</h3>

                <p className="text-sm text-gray-500">
                  {video.videoCategory || "No Category"}
                </p>

                <p className="text-sm text-gray-400">
                  {video.isVisible ? "Visible" : "Hidden"}
                </p>
              </div>

              <div className="flex gap-2">
                <Link href={`/admin/videos/edit/${video.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 border-amber-200 hover:bg-amber-50 text-amber-600"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Button>
                </Link>

                <DeleteVideoButton action={deleteAction.bind(null, video.id)} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Page;