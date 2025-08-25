"use client";
import { useEffect } from "react";

interface Props {
  content: string;
  setContent: (value: string) => void;
}

export default function CKEditor4Wrapper({ content, setContent }: Props) {
  useEffect(() => {
    const loadCk = async () => {
      if (!document.getElementById("ckeditor-script")) {
        const script = document.createElement("script");
        script.id = "ckeditor-script";
        script.src = "https://cdn.ckeditor.com/4.22.1/full-all/ckeditor.js";
        script.onload = () => {
          if ((window as any).CKEDITOR && !(window as any).CKEDITOR.instances.editor1) {
            (window as any).CKEDITOR!.replace("editor1", {
              height: 400,
              extraPlugins: "colorbutton,font,justify",
              removePlugins: "elementspath",
              resize_enabled: true,
              toolbar: [
                ["Format"], // 👈 Heading, Paragraph, H1–H6
                ["Bold", "Italic", "Underline", "Strike"],
                ["NumberedList", "BulletedList"],
                ["Link", "Unlink"],
                ["JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock"],
                ["TextColor", "BGColor"],
                ["Font", "FontSize"],
                ["Source", "Maximize"],
              ],

            });

            const ckeditor = (window as any).CKEDITOR;
            ckeditor.instances.editor1.setData(content);

            ckeditor.instances.editor1.on("change", function (this: any) {
              setContent(this.getData());
            });
          }
        };
        document.body.appendChild(script);
      }
    };

    loadCk();
  }, []);

  return <textarea id="editor1" defaultValue={content}></textarea>;
}

