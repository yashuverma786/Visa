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
              extraPlugins: "colorbutton,font,justify,format", // 👈 format plugin add kar
              removePlugins: "elementspath",
              resize_enabled: true,
              toolbar: [
                ["Format"], // ye ab headings dropdown dikhayega
                ["Bold", "Italic", "Underline", "Strike"],
                ["NumberedList", "BulletedList"],
                ["Link", "Unlink"],
                ["JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock"],
                ["TextColor", "BGColor"],
                ["Font", "FontSize"],
                ["Source", "Maximize"],
              ],
              format_tags: "p;h1;h2;h3;h4;h5;h6;pre", // 👈 ab dropdown me ye options honge
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

