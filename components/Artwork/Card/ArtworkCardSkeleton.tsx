import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ArtworkCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full">
      <CardContent className="p-0 h-full flex flex-col">
        <Skeleton className="aspect-square w-full" />

        <div className="p-4 h-[100px] flex flex-col justify-between">
          <div className="flex-1 flex flex-col justify-center space-y-2">
            <div className="h-[2.5rem] flex items-start">
              <div className="space-y-1 w-full">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>

            <div className="h-5 flex items-center">
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
