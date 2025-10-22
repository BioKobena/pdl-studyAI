import { Card } from "./card";

export function ResumePDFViewer() {
  return (
    <div className="relative">
      <Card className="bg-white border-4 border-gray-700 shadow-xl max-w-2xl mx-auto">
        <div className="p-12 text-[#0a0a0a]">
          <h2 className="text-center mb-6">Adobe Acrobat PDF Files</h2>
          
          <div className="space-y-4 text-justify">
            <p>
              Adobe® Portable Document Format (PDF) is a universal file format that preserves all
              of the fonts, formatting, colours and graphics of any source document, regardless of
              the application and platform used to create it.
            </p>
            
            <p>
              Adobe PDF is an ideal format for electronic document distribution as it overcomes the
              problems commonly encountered with electronic file sharing.
            </p>
            
            <ul className="space-y-3 list-disc list-outside ml-5">
              <li>
                <span className="italic">Anyone, anywhere</span> can open a PDF file. All you need is the free Adobe Acrobat
                Reader. Recipients of other file formats sometimes can&apos;t open files because they
                don&apos;t have the applications used to create the documents.
              </li>
              
              <li>
                PDF files <span className="italic">always print correctly</span> on any printing device.
              </li>
              
              <li>
                PDF files always display <span className="italic">exactly</span> as created, regardless of fonts, software, and
                operating systems. Fonts, and graphics are not lost due to platform, software, and
                version incompatibilities.
              </li>
              
              <li>
                The free Acrobat Reader is easy to download and can be freely distributed by
                anyone.
              </li>
              
              <li>
                Compact PDF files are smaller than their source files and download a
                page at a time for fast display on the Web.
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}