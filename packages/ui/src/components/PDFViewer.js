import { Spinner } from '@nextui-org/react';
import React, { useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PDFViewer = ({ file_url }) => {
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setPageNumber(numPages);
  }

  return (
    <div className=''>
      <Document
        file={file_url}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className='flex items-center justify-center'>
            <Spinner />
          </div>
        }
      >
        <Page pageNumber={1} />
      </Document>

      {pageNumber > 1 ? (
        Array.from(Array(pageNumber - 1).keys())?.map((e, index) => (
          <Document file={file_url} key={`pdf-index-${index}`}>
            <Page pageNumber={index + 2} />
          </Document>
        ))
      ) : (
        <div />
      )}
    </div>
  );
};

export default PDFViewer;
