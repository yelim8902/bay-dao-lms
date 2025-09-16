"use client";

import React, { useRef } from "react";
import { Award, Download, Share2, X } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  courseName: string;
  completionDate: string;
  walletAddress: string;
}

export function CertificateModal({
  isOpen,
  onClose,
  studentName,
  courseName,
  completionDate,
  walletAddress,
}: CertificateModalProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = React.useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    setIsDownloading(true);
    try {
      // 인증서 영역을 캔버스로 변환
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // 고해상도
        backgroundColor: "#ffffff",
        useCORS: true,
      });

      // PDF 생성
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // 이미지 비율 계산
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;

      // 중앙 정렬
      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;

      pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);

      // 파일명 생성
      const fileName = `Bay_DAO_Certificate_${courseName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;

      pdf.save(fileName);

      alert("🎉 인증서 PDF가 다운로드되었습니다!");
    } catch (error) {
      console.error("PDF 다운로드 실패:", error);
      alert("❌ PDF 다운로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    const shareText = `🎓 Bay DAO에서 "${courseName}" 과정을 성공적으로 완료했습니다! 
    
완료일: ${completionDate}
지갑: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}

#BayDAO #블록체인교육 #Web3`;

    if (navigator.share) {
      navigator.share({
        title: "Bay DAO 수료 인증서",
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert("📋 인증서 정보가 클립보드에 복사되었습니다!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Award className="h-6 w-6 text-yellow-600 mr-2" />
            수료 인증서
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* 인증서 본문 */}
        <div className="p-8">
          {/* 인증서 디자인 */}
          <div
            ref={certificateRef}
            className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-xl p-8 text-center"
          >
            {/* 헤더 */}
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Certificate of Completion
              </h1>
              <p className="text-lg text-gray-600">수료 인증서</p>
            </div>

            {/* 구분선 */}
            <div className="border-t-2 border-blue-300 mx-8 mb-8"></div>

            {/* 내용 */}
            <div className="space-y-6">
              <p className="text-lg text-gray-700">This is to certify that</p>

              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h2 className="text-2xl font-bold text-blue-900">
                  {studentName || "Bay DAO Student"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Wallet: {walletAddress.slice(0, 8)}...
                  {walletAddress.slice(-6)}
                </p>
              </div>

              <p className="text-lg text-gray-700">
                has successfully completed the course
              </p>

              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h3 className="text-xl font-bold text-indigo-900">
                  {courseName}
                </h3>
              </div>

              <p className="text-lg text-gray-700">
                and has demonstrated proficiency in blockchain technology, DAO
                governance, and Web3 development.
              </p>

              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <p className="text-lg font-semibold text-gray-900">
                  Completion Date: {completionDate}
                </p>
              </div>
            </div>

            {/* 서명 */}
            <div className="mt-8 pt-8 border-t-2 border-blue-300">
              <div className="flex justify-between items-end">
                <div>
                  <div className="w-32 border-b border-gray-400 mb-2"></div>
                  <p className="text-sm text-gray-600">Bay DAO</p>
                  <p className="text-xs text-gray-500">Authorized Signature</p>
                </div>
                <div>
                  <div className="w-32 border-b border-gray-400 mb-2"></div>
                  <p className="text-sm text-gray-600">Blockchain Verified</p>
                  <p className="text-xs text-gray-500">Smart Contract</p>
                </div>
              </div>
            </div>

            {/* QR 코드 영역 (향후 추가) */}
            <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
              <p className="text-xs text-gray-500">
                🔗 Blockchain verification available on Etherscan
              </p>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-5 w-5 mr-2" />
              {isDownloading ? "PDF 생성 중..." : "PDF 다운로드"}
            </button>
            <button
              onClick={handleShare}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <Share2 className="h-5 w-5 mr-2" />
              공유하기
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            이 인증서는 블록체인에 기록되어 영구적으로 검증 가능합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
