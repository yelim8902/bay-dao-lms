"use client";

import React, { useState } from "react";
import {
  X,
  Upload,
  Link,
  FileText,
  Image,
  FileDown,
  Plus,
  Trash2,
} from "lucide-react";

interface AssignmentSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignmentTitle: string;
  onSubmit: (submission: {
    links: string[];
    files: File[];
    description: string;
  }) => void;
}

export function AssignmentSubmissionModal({
  isOpen,
  onClose,
  assignmentTitle,
  onSubmit,
}: AssignmentSubmissionModalProps) {
  const [links, setLinks] = useState<string[]>([""]);
  const [files, setFiles] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addLinkField = () => {
    setLinks([...links, ""]);
  };

  const updateLink = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const removeLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks.length === 0 ? [""] : newLinks);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const validLinks = links.filter((link) => link.trim() !== "");

    if (
      validLinks.length === 0 &&
      files.length === 0 &&
      description.trim() === ""
    ) {
      alert("링크, 파일, 또는 설명 중 하나는 반드시 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        links: validLinks,
        files,
        description: description.trim(),
      });

      // 초기화
      setLinks([""]);
      setFiles([]);
      setDescription("");
      onClose();
    } catch (error) {
      console.error("제출 실패:", error);
      alert("❌ 제출에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <Image className="h-4 w-4" />;
    if (file.type === "application/pdf")
      return <FileDown className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const getFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">과제 제출</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* 과제 정보 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-1">
              {assignmentTitle}
            </h3>
            <p className="text-blue-800 text-sm">
              과제 결과물을 아래 방법 중 하나 이상으로 제출해주세요.
            </p>
          </div>

          {/* 링크 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Link className="h-4 w-4 inline mr-2" />
              링크 (블로그, GitHub, 노션 등)
            </label>
            <div className="space-y-2">
              {links.map((link, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => updateLink(index, e.target.value)}
                    placeholder="https://example.com/my-project"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {links.length > 1 && (
                    <button
                      onClick={() => removeLink(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addLinkField}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>링크 추가</span>
              </button>
            </div>
          </div>

          {/* 파일 업로드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Upload className="h-4 w-4 inline mr-2" />
              파일 업로드 (PDF, 이미지, 문서 등)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.txt,.md"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">클릭하여 파일 선택</p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, DOC, 이미지, 텍스트 파일 지원
                </p>
              </label>
            </div>

            {/* 업로드된 파일 목록 */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  업로드된 파일:
                </p>
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                  >
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {getFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 설명 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <FileText className="h-4 w-4 inline mr-2" />
              과제 설명 및 후기
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="과제를 수행하면서 배운 점, 어려웠던 점, 개선사항 등을 자유롭게 작성해주세요..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* 제출 버튼 */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "제출 중..." : "과제 제출하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
