import React from 'react';
import './RichTextEditor.css';

/**
 * RichTextEditor Component
 * Rich text editing for progress notes
 * 
 * INSTALLATION REQUIRED:
 * npm install react-quill
 * 
 * Props:
 * - value: string - HTML content
 * - onChange: function - Callback with HTML string
 * - placeholder: string - Placeholder text
 * - readOnly: boolean - Read-only mode
 */
const RichTextEditor = ({ value, onChange, placeholder = 'Write your progress notes...', readOnly = false }) => {
  // Lazy load react-quill to reduce bundle size
  const [ReactQuill, setReactQuill] = React.useState(null);

  React.useEffect(() => {
    import('react-quill').then(module => {
      setReactQuill(() => module.default);
    });
  }, []);

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, false] }],
      ['link', 'code-block'],
      ['clean']
    ]
  };

  const formats = [
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'header',
    'link', 'code-block'
  ];

  if (!ReactQuill) {
    return (
      <div className="rich-editor-loading">
        <span>Loading editor...</span>
      </div>
    );
  }

  return (
    <div className={`rich-editor-container ${readOnly ? 'read-only' : ''}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </div>
  );
};

export default RichTextEditor;
