"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ChevronDown, ChevronUp, Code } from "lucide-react";
import { toast } from "sonner";

/* eslint-disable @typescript-eslint/no-explicit-any */

type Props = {
  seoSchemas: any[];
  setSeoSchemas: React.Dispatch<React.SetStateAction<any[]>>;
};

export default function SeoSchemaSection({ seoSchemas, setSeoSchemas }: Props) {
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  const addSchema = () => {
    setSeoSchemas([
      ...seoSchemas,
      {
        "@context": "https://schema.org",
        "@type": "",
      },
    ]);
  };

  const removeSchema = (index: number) => {
    setSeoSchemas(seoSchemas.filter((_, i) => i !== index));
  };

  const updateSchema = (index: number, jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      const updated = [...seoSchemas];
      updated[index] = parsed;
      setSeoSchemas(updated);
    } catch {
      // Don't update state on invalid JSON — let the user keep typing
    }
  };

  const handlePaste = (index: number, value: string) => {
    try {
      const parsed = JSON.parse(value);
      const updated = [...seoSchemas];
      updated[index] = parsed;
      setSeoSchemas(updated);
      toast.success(`Schema #${index + 1} updated`);
    } catch {
      toast.error("Invalid JSON pasted");
    }
  };

  const toggleCollapse = (index: number) => {
    setCollapsed((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const formatJson = (index: number) => {
    try {
      const formatted = JSON.stringify(seoSchemas[index], null, 2);
      // Trigger a re-render with formatted version
      const updated = [...seoSchemas];
      updated[index] = JSON.parse(formatted);
      setSeoSchemas(updated);
      toast.success("JSON formatted");
    } catch {
      toast.error("Cannot format invalid JSON");
    }
  };

  return (
    <Card className="m-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code size={20} />
          SEO Schemas (JSON-LD)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Add structured data schemas for this product. Each schema should be a
          valid JSON-LD object.
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        {seoSchemas.map((schema, index) => {
          const jsonStr = JSON.stringify(schema, null, 2);
          const isCollapsed = collapsed[index];
          const schemaType =
            schema?.["@type"] ||
            (Array.isArray(schema?.["@type"])
              ? schema["@type"].join(", ")
              : "Untitled");

          return (
            <div
              key={index}
              className="border rounded-2xl p-5 space-y-4 bg-[#fafafa]"
            >
              {/* TOP BAR */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="flex items-center gap-2 text-sm font-semibold text-black hover:text-gray-700 transition-colors"
                  onClick={() => toggleCollapse(index)}
                >
                  {isCollapsed ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronUp size={16} />
                  )}
                  Schema #{index + 1}
                  {schemaType && (
                    <span className="text-xs font-normal text-muted-foreground bg-gray-200 px-2 py-0.5 rounded-full">
                      {schemaType}
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => formatJson(index)}
                  >
                    Format
                  </Button>

                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeSchema(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              {/* JSON EDITOR */}
              {!isCollapsed && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">
                    JSON-LD Content
                  </label>

                  <Textarea
                    placeholder='{"@context": "https://schema.org", "@type": "Product", ...}'
                    defaultValue={jsonStr}
                    onBlur={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        const updated = [...seoSchemas];
                        updated[index] = parsed;
                        setSeoSchemas(updated);
                      } catch {
                        toast.error(
                          `Schema #${index + 1}: Invalid JSON. Please fix before saving.`
                        );
                      }
                    }}
                    onPaste={(e) => {
                      // If the field is empty and something is pasted, try to parse it
                      const pastedText = e.clipboardData.getData("text");
                      if (pastedText) {
                        setTimeout(() => {
                          handlePaste(index, pastedText);
                        }, 0);
                      }
                    }}
                    className="min-h-[200px] font-mono text-sm leading-relaxed"
                    spellCheck={false}
                  />

                  <p className="text-xs text-muted-foreground">
                    Paste or type valid JSON-LD. The content will be validated
                    on blur.
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {/* ADD BUTTON */}
        <Button
          type="button"
          variant="outline"
          onClick={addSchema}
          className="w-full"
        >
          <Plus size={16} className="mr-2" />
          Add SEO Schema
        </Button>
      </CardContent>
    </Card>
  );
}
