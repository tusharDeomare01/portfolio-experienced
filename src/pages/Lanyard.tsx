import { lazy, Suspense } from "react";
import { PageLoader } from "../components/Loading/LoadingComponents";
import { ArrowLeft } from "lucide-react";
import { ShareButton } from "@/components/Share";
import { getCurrentUrl } from "@/lib/shareUtils";
import { useNavigate } from "react-router-dom";
import { useGSAPScrollRestoration } from "@/hooks/useGSAPScrollRestoration";

const Lanyard = lazy(() => import("../components/reactBits/lanYard"));

const LanyardPage = () => {
  const navigate = useNavigate();
  const { saveScrollPosition } = useGSAPScrollRestoration();
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
        <button
          onClick={(e) => {
            e.preventDefault();
            const splitUrl = window.location.href.split("#");
            if (splitUrl?.includes("home")) {
              const scrollY = saveScrollPosition();
              navigate("/", {
                state: {
                  scrollTo: "home",
                  scrollY,
                  from: "home-to-home",
                },
              });
            } else {
              navigate(-1);
            }
          }}
          className="cursor-pointer flex items-center gap-2 text-foreground hover:text-primary transition-colors group touch-manipulation"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-sm sm:text-base">Back</span>
        </button>
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
