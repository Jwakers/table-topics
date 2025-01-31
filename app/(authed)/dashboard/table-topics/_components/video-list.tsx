import { getUserVideos } from "@/app/server/db/queries";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROUTES } from "@/lib/constants";
import { formatDuration } from "@/lib/utils";
import { Play } from "lucide-react";
import Link from "next/link";
import { memo, use } from "react";
import NoVideos from "./no-videos";

type VideoListProps = {
  videoListPromise: ReturnType<typeof getUserVideos>;
};

const MemoizedNoVideos = memo(NoVideos);

export function VideoList({ videoListPromise }: VideoListProps) {
  const { videos } = use(videoListPromise);

  if (!videos.length) return <MemoizedNoVideos />;

  return (
    <Card>
      <CardHeader>
        <h1 className="text-2xl md:text-3xl">Manage recordings</h1>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>
            A list of your recent Table Topics recordings.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Topic</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.id}>
                <TableCell className="font-medium">
                  {video.tableTopic.topic}
                </TableCell>
                <TableCell>
                  {new Date(video.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <span
                    aria-label={`Duration: ${
                      video.duration
                        ? `${Math.floor(video.duration / 60)} minutes and ${
                            video.duration % 60
                          } seconds`
                        : "Not available"
                    }`}
                  >
                    {formatDuration(video.duration)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`${ROUTES.dashboard.tableTopics.manage}/${video.id}`}
                    >
                      <Play />
                      <span>View</span>
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>{/* Pagination placeholder location */}</CardFooter>
    </Card>
  );
}

export function VideoListSkeleton() {
  return (
    <Card>
      <CardHeader>
        <h1 className="text-2xl md:text-3xl">Manage recordings</h1>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>
            Loading your recent Table Topics recordings...
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Topic</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-[20px] rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-[20px] rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-[20px] rounded-full" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-[20px] rounded-full" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>{/* Pagination placeholder location */}</CardFooter>
    </Card>
  );
}
