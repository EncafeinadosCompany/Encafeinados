import { QRCodeSVG } from "qrcode.react";

export function QRCode({ url, width }: { url: string, width?:number }) {
  return (
    <div className="w-full h-auto flex justify-center items-center">
      <QRCodeSVG
        value={url}
        level="H"
        style={{
          width: "100%",
          height: "auto",
          maxWidth: width ? width : 300,
        }}
      />
    </div>
  );
}
