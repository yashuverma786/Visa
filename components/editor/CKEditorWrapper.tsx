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
        <script src="https://cdn.ckbox.io/ckbox/2.4.0/ckbox.js"></script>
        script.src =
          "https://cdn.ckeditor.com/4.22.1/full-all/ckeditor.js"; // 👈 full-all 
        script.onload = () => {
          if (

            (window as any).CKEDITOR!.replace("editor1", {
              extraPlugins: "image,uploadimage",
            })
              (window as any).CKEDITOR &&
            !(window as any).CKEDITOR.instances.editor1
          ) {
            (window as any).CKEDITOR.replace("editor1", {
              height: 400,
              extraPlugins: "uploadimage,image2,colorbutton,font,justify,format",
              removePlugins: "elementspath",
              resize_enabled: true,
              filebrowserUploadUrl: "/api/upload",   // 👈 yeh endpoint banayenge
              filebrowserUploadMethod: "form",
              toolbar: [
                ["Format"],
                ["Bold", "Italic", "Underline", "Strike"],
                ["NumberedList", "BulletedList"],
                ["Link", "Unlink"],
                ["JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock"],
                ["TextColor", "BGColor"],
                ["Font", "FontSize"],
                ["Image", "Source", "Maximize"],
              ],
              format_tags: "p;h1;h2;h3;h4;h5;h6;pre",
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
