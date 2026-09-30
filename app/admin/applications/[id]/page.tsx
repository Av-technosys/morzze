import { getApplicationById } from "@/helper/applications/action";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import Link from "@/hooks/appLink"
import {
  ArrowLeft,
  FileText,
  Mail,
  Phone,
  User,
  CalendarDays,
} from "lucide-react";
import { ContactLink } from "@/components/ContactLink";

export default async function ApplicationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const application = await getApplicationById(id);

  if (!application) return notFound();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/applications">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>

        <a
          href={application.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button >
            <FileText className="w-4 h-4 mr-2" />
            Open Resume
          </Button>
        </a>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-8">
        <h1 className="text-2xl font-bold mb-8">Application Details</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-2 text-[#2D5A5D]">
              <User className="w-4 h-4" />
              <p className="text-sm font-medium">Full Name</p>
            </div>
            <p className="text-lg font-semibold">{application.name}</p>
          </div>

          <div className="border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-2 text-[#2D5A5D]">
              <Mail className="w-4 h-4" />
              <p className="text-sm font-medium">Email Address</p>
            </div>
            <p className="text-lg font-semibold break-all">
              <ContactLink type="email" value={application.email} />
            </p>
          </div>

          <div className="border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-2 text-[#2D5A5D]">
              <Phone className="w-4 h-4" />
              <p className="text-sm font-medium">Mobile Number</p>
            </div>
            <p className="text-lg font-semibold">
              <ContactLink type="phone" value={application.mobileNumber} />
            </p>
          </div>

          <div className="border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-2 text-[#2D5A5D]">
              <CalendarDays className="w-4 h-4" />
              <p className="text-sm font-medium">Applied On</p>
            </div>
            <p className="text-lg font-semibold">
              {application.createdAt
                ? new Date(application.createdAt).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="mt-6 border rounded-lg p-5">
          <p className="text-sm font-medium text-[#2D5A5D] mb-2">Subject</p>
          <p className="text-lg font-semibold">{application.subject}</p>
        </div>

        <div className="mt-6 border rounded-lg p-5">
          <p className="text-sm font-medium text-[#2D5A5D] mb-3">
            Description
          </p>
          <p className="text-gray-700 leading-7 whitespace-pre-line">
            {application.description}
          </p>
        </div>
      </div>
    </div>
  );
}
