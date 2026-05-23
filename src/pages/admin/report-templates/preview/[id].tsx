import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import Link from "next/link";
import Head from "next/head";
import { reportTemplateAPI } from "../../../../utils/api";
import { ReportTemplate } from "../../../../types";
import { FaArrowLeft, FaEdit, FaFileAlt } from "react-icons/fa";
import { formatDate } from "../../../../utils/date";

const CATEGORY_COLORS: Record<string, string> = {
  BLOOD_TEST: "bg-red-100 text-red-800",
  URINE_TEST: "bg-yellow-100 text-yellow-800",
  X_RAY: "bg-blue-100 text-blue-800",
  ECG: "bg-green-100 text-green-800",
  ULTRASOUND: "bg-purple-100 text-purple-800",
  GENERAL_REPORT: "bg-gray-100 text-gray-800",
};

export default function TemplatePreviewPage() {
  const router = useRouter();
  const { id } = router.query;
  const templateId = Number(id);

  const { data: template, isLoading, error } = useQuery<ReportTemplate>(
    ["template", templateId],
    () => reportTemplateAPI.getTemplateById(templateId),
    { enabled: !!templateId }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="space-y-4">
        <Link href="/admin/report-templates/view" className="flex items-center text-sm text-gray-500 hover:text-gray-700 gap-1.5">
          <FaArrowLeft className="h-3.5 w-3.5" /> Back to Templates
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          Failed to load template.
        </div>
      </div>
    );
  }

  const canvasSize = template.layoutConfig?.canvasSize ?? { width: 794, height: 1123 };
  const pageSize = template.layoutConfig?.pageSize ?? "A4";
  const pageOrientation = template.layoutConfig?.pageOrientation ?? "portrait";
  const staticElements: any[] = template.staticContent?.elements ?? [];
  const dynamicFields: any[] = template.dynamicFields?.fields ?? [];

  // Scale canvas to fit the preview container (max 700px wide)
  const maxPreviewWidth = 700;
  const scale = Math.min(1, maxPreviewWidth / canvasSize.width);

  return (
    <>
      <Head>
        <title>{template.templateName} — Preview | Medical Center</title>
      </Head>

      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/report-templates/view"
              className="flex items-center text-sm text-gray-500 hover:text-gray-700 gap-1.5"
            >
              <FaArrowLeft className="h-3.5 w-3.5" /> Back
            </Link>
            <div className="h-4 w-px bg-gray-300" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">{template.templateName}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[template.category] ?? "bg-gray-100 text-gray-700"}`}>
                  {template.category.replace(/_/g, " ")}
                </span>
                <span className="text-xs text-gray-400">{pageSize} · {pageOrientation}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/admin/report-templates/designer?templateId=${template.templateId}`}
              className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <FaEdit className="h-3.5 w-3.5" /> Edit
            </Link>
            <Link
              href={`/reports/template-based?templateId=${template.templateId}`}
              className="flex items-center gap-1.5 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FaFileAlt className="h-3.5 w-3.5" /> Use Template
            </Link>
          </div>
        </div>

        {/* Meta */}
        {template.description && (
          <p className="text-sm text-gray-500">{template.description}</p>
        )}

        {/* Stats row */}
        <div className="flex gap-4 text-sm text-gray-500">
          <span>{staticElements.length} static element{staticElements.length !== 1 ? "s" : ""}</span>
          <span>·</span>
          <span>{dynamicFields.length} dynamic field{dynamicFields.length !== 1 ? "s" : ""}</span>
          <span>·</span>
          <span>Created {formatDate(template.createdDate)}</span>
        </div>

        {/* Canvas Preview */}
        <div className="bg-gray-100 rounded-xl border border-gray-200 p-6 overflow-auto">
          <div
            style={{
              width: canvasSize.width * scale,
              height: canvasSize.height * scale,
              position: "relative",
              background: "white",
              boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
            }}
          >
            {/* inner scaled container */}
            <div
              style={{
                width: canvasSize.width,
                height: canvasSize.height,
                position: "absolute",
                top: 0,
                left: 0,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              {/* Static elements */}
              {staticElements.map((el: any) => (
                <div
                  key={el.id}
                  style={{
                    position: "absolute",
                    left: el.position.x,
                    top: el.position.y,
                    width: el.size.width,
                    height: el.size.height,
                    fontSize: el.style?.fontSize ?? 14,
                    fontWeight: el.style?.fontWeight ?? "normal",
                    textAlign: el.style?.textAlign ?? "left",
                    color: el.style?.color ?? "#333",
                    overflow: "hidden",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {el.content}
                </div>
              ))}

              {/* Dynamic fields */}
              {dynamicFields.map((field: any) => (
                <div
                  key={field.id}
                  style={{
                    position: "absolute",
                    left: field.position.x,
                    top: field.position.y,
                    width: field.size.width,
                    height: field.size.height,
                    border: "1.5px dashed #93c5fd",
                    borderRadius: 4,
                    background: "#eff6ff",
                    padding: "4px 6px",
                    fontSize: 12,
                    color: "#1d4ed8",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 11, marginBottom: 2, color: "#1e40af" }}>
                    {field.label}
                  </div>
                  <div style={{ fontSize: 10, color: "#3b82f6" }}>
                    {field.dataMapping ? `↳ ${field.dataMapping}` : "(no mapping)"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic fields list */}
        {dynamicFields.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-700">Dynamic Fields</h2>
            </div>
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-5 py-2.5 text-left">Label</th>
                  <th className="px-5 py-2.5 text-left">Type</th>
                  <th className="px-5 py-2.5 text-left">Data Mapping</th>
                  <th className="px-5 py-2.5 text-left">Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dynamicFields.map((field: any) => (
                  <tr key={field.id} className="hover:bg-gray-50">
                    <td className="px-5 py-2.5 font-medium text-gray-800">{field.label}</td>
                    <td className="px-5 py-2.5 text-gray-500 capitalize">{field.fieldType}</td>
                    <td className="px-5 py-2.5 text-gray-500">
                      {field.dataMapping || <span className="text-red-400">Not mapped</span>}
                    </td>
                    <td className="px-5 py-2.5 text-gray-500">
                      {field.required ? (
                        <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">Required</span>
                      ) : (
                        <span className="text-xs text-gray-400">Optional</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
