import { Download, FileText, ExternalLink } from "lucide-react";
import { useState } from "react";
import { ScrollReveal } from "../lightswind/scroll-reveal";
import { ShareButton } from "../Share";
import { getBaseUrl } from "@/lib/shareUtils";

// Resume file configuration
const RESUME_FILE_PATH = "/Tushar_Deomare.pdf";
const RESUME_FILE_NAME = "Tushar_Deomare.pdf";

// Main Resume Section Component
export function ResumeSection() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);

    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = RESUME_FILE_PATH;
    link.download = RESUME_FILE_NAME;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Reset downloading state after animation
    setTimeout(() => setIsDownloading(false), 2000);
  };

  const handleView = () => {
    window.open(RESUME_FILE_PATH, "_blank");
  };

  return (
    <div
      id="resume"
      className="min-h-screen flex flex-col justify-center !bg-transparent"
    >
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-16 w-full !bg-transparent">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="mb-4 flex items-baseline justify-center gap-4">
            <FileText className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-primary flex-shrink-0 mt-1.5 md:mt-2 lg:mt-2.5" />
            <ScrollReveal
              size="2xl"
              align="center"
              variant="default"
              enableBlur={false}
              blurStrength={0}
              baseRotation={0}
            >
              Resume
            </ScrollReveal>
          </div>
          <p className="text-lg font-bold">
            Download my professional resume or view key highlights of my career
          </p>
        </div>

        {/* Resume Content */}
        <div className="max-w-4xl mx-auto">
          {/* PDF Preview Container */}
          <div
            className="relative w-full overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* PDF Preview */}
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              {/* Desktop: PDF Embed */}
              <div className="hidden sm:block w-full h-full">
                <iframe
                  src={`${RESUME_FILE_PATH}#toolbar=0&navpanes=0&scrollbar=0&zoom=page-width`}
                  className="w-[92%] h-[89%] flex justify-center items-center"
                  title="Resume Preview"
                  allowFullScreen={true}
                  allowTransparency={false}
                  key={"resume"}
                  loading="eager"
                />
              </div>

              {/* Mobile: Modern PDF Preview Card */}
              <div className="lg:hidden flex flex-col items-center justify-center h-full p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-background dark:from-primary/20 dark:via-primary/10 dark:to-background">
                {/* Large Document Icon with Glow Effect */}
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
                  <FileText className="w-24 h-24 text-primary dark:text-primary/80 relative z-10" />
                </div>

                {/* PDF File Name */}
                <div className="mb-8 text-center">
                  <p className="text-xl font-bold text-foreground mb-2">
                    {RESUME_FILE_NAME}
                  </p>
                  <p className="text-sm text-muted-foreground">PDF Document</p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 left-4 w-2 h-2 bg-primary/30 rounded-full"></div>
                <div className="absolute top-6 right-6 w-1.5 h-1.5 bg-primary/20 rounded-full"></div>
                <div className="absolute bottom-8 left-6 w-1 h-1 bg-primary/25 rounded-full"></div>
              </div>

              {/* Desktop Hover Overlay */}
              <div
                className={`hidden lg:flex absolute inset-0 bg-background/80 transition-opacity duration-300 items-center justify-center gap-4 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              >
                <button
                  onClick={handleView}
                  className="px-5 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Full
                </button>
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="px-5 py-3 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-400 text-white rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download
                    className={`w-4 h-4 ${
                      isDownloading ? "animate-bounce" : ""
                    }`}
                  />
                  {isDownloading ? "Downloading..." : "Download"}
                </button>
                <div className="flex justify-center">
                  <ShareButton
                    shareData={{
                      title: "Tushar Deomare - Resume",
                      description:
                        "Check out my professional resume and career highlights",
                      url: `${getBaseUrl()}/#resume`,
                    }}
                    variant="outline"
                    size="md"
                    showLabel={true}
                    position="top"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons - Mobile */}
            <div className="lg:hidden mt-6 space-y-3">
              {/* View Button - Full Width, Middle */}
              <button
                onClick={handleView}
                className="w-full px-6 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-xl text-base font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                <ExternalLink className="w-5 h-5" />
                View Resume
              </button>

              {/* Download and Share Buttons - Side by Side */}
              <div className="flex gap-3">
                {/* Download Button - Left */}
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex-1 h-[56px] px-4 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-400 text-white rounded-xl text-base font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download
                    className={`w-5 h-5 ${
                      isDownloading ? "animate-bounce" : ""
                    }`}
                  />
                  {isDownloading ? "Downloading..." : "Download"}
                </button>

                {/* Share Button - Right */}
                <div className="flex-1 h-[56px]">
                  <ShareButton
                    shareData={{
                      title: "Tushar Deomare - Resume",
                      description:
                        "Check out my professional resume and career highlights",
                      url: `${getBaseUrl()}/#resume`,
                    }}
                    variant="outline"
                    size="lg"
                    showLabel={true}
                    position="top"
                    className="w-full h-full !min-h-[56px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
