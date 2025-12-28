import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { PageLoader } from "../components/Loading/LoadingComponents";
import { ArrowLeft } from "lucide-react";
import { ShareButton } from "@/components/Share";
import { getCurrentUrl } from "@/lib/shareUtils";

const Lanyard = lazy(() => import("../components/reactBits/lanYard"));

const LanyardPage = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Suspense fallback={<PageLoader />}>
        <Lanyard
          position={[0, 0, 30]}
          gravity={[0, -40, 0]}
          fov={20}
          transparent={true}
        />
      </Suspense>

      {/* Back Button and Share */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between flex-wrap gap-3 sm:gap-4">
        <Link
          to="/"
          className="px-4 py-2 bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-lg text-foreground hover:bg-white/20 dark:hover:bg-black/20 transition-colors duration-200 flex items-center gap-2 group shrink-0"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </Link>
        <ShareButton
          shareData={{
            title: "My Card - Interactive 3D Lanyard",
            description:
              "Check out my interactive 3D lanyard card experience. Drag it around and explore a unique way to view my contact information.",
            url: getCurrentUrl(),
          }}
          variant="outline"
          size="md"
          showLabel={true}
          position="left"
          className="shrink-0 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default LanyardPage;
