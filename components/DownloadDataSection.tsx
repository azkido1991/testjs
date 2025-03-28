"use client";

import Button from "@/components/Button";
import Loading from "@/app/[locale]/blog/loading";
import { downloadUserData } from "@/actions/download";
import { useTranslations } from "next-intl";
import { useState } from "react";
import toast from "react-hot-toast";

const DownloadDataSection = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const t = useTranslations("dashboard");

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const data = await downloadUserData();
      if (!data) throw new Error("No data available");

      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "user_data.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      toast.error("Error downloading data. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className="flex flex-col items-start mx-auto max-w-2xl gap-8 px-4 sm:px-6 py-20 lg:px-8"
      role="region"
      aria-labelledby="export-data-heading"
    >
      <div>
        <h2
          id="export-data-heading"
          className="text-2xl font-semibold dark:text-white leading-tight"
        >
          {t("exportData.title")}
        </h2>
        <p className="mt-4 text-base dark:text-gray-300 leading-relaxed">
          {t("exportData.description")}
        </p>
        <p className="mt-2 text-sm dark:text-gray-400">
          {t("exportData.details")}
        </p>
      </div>

      <Button
        type="button"
        className="inline-flex items-center justify-center rounded-lg bg-green-600 px-5 py-3 text-sm font-medium text-white shadow-lg transition duration-300 ease-in-out transform hover:bg-green-500 hover:scale-105 focus:outline-none focus-visible:ring focus-visible:ring-green-400 focus-visible:ring-opacity-75 disabled:cursor-not-allowed disabled:bg-gray-400"
        onClick={handleDownload}
        disabled={isDownloading}
        isLoading={isDownloading}
        label={t("exportData.button")}
        pendingContent={t("exportData.downloadLoading")}
        loadingComponent={
          <div className="relative w-6 h-6">
            <Loading color="white" />
          </div>
        }
        aria-label={
          isDownloading
            ? "Downloading your account data"
            : "Download your account data"
        }
      />
    </div>
  );
};

export default DownloadDataSection;
