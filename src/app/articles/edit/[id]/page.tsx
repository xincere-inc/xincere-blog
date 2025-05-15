'use client';

import { Article, ArticleStatus } from '@prisma/client';
import MDEditor from '@uiw/react-md-editor';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';

type ArticleWithTags = Partial<Article> & {
  tags?: { tag: { id: number; name: string } }[];
};

const mockArticle: ArticleWithTags = {
  id: 1,
  title: 'Mastering Next.js in 2025',
  slug: 'mastering-nextjs-2025',
  summary: 'A comprehensive guide to Next.js in 2025.',
  content: '# Mastering Next.js\nLearn the latest features of Next.js.',
  thumbnailUrl:
    'https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fqn59agr1g40svv6krfkz.jpg',
  status: ArticleStatus.DRAFT,
  categoryId: 1,
  tags: [
    { tag: { id: 1, name: 'Next.js' } },
    { tag: { id: 2, name: 'Web Dev' } },
  ],
};

const mockTags = [
  { id: 1, name: 'Next.js' },
  { id: 2, name: 'Web Dev' },
  { id: 3, name: 'React' },
  { id: 4, name: 'JavaScript' },
];

export default function ArticleEditPage() {
  const router = useRouter();
  const { id } = useParams();
  const isNew = id === 'new';

  const [form, setForm] = useState<ArticleWithTags>({
    title: '',
    slug: '',
    summary: '',
    content: '',
    thumbnailUrl: '',
    status: ArticleStatus.DRAFT,
    categoryId: undefined,
    tags: [],
  });
  const [tags, setTags] = useState<string[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    if (!isNew && mockArticle.thumbnailUrl) {
      // Validate image URL by attempting to load it
      const img = new Image();
      img.src = mockArticle.thumbnailUrl;
      img.onload = () => {
        setForm(mockArticle);
        setTags(mockArticle.tags?.map((t) => t.tag.name) || []);
        setPreview(mockArticle.thumbnailUrl || null);
      };
      img.onerror = () => {
        setPreviewError('Failed to load thumbnail image');
        setForm({ ...mockArticle, thumbnailUrl: '' });
        setTags(mockArticle.tags?.map((t) => t.tag.name) || []);
      };
    } else if (isNew) {
      setForm({
        title: '',
        slug: '',
        summary: '',
        content: '',
        thumbnailUrl: '',
        status: ArticleStatus.DRAFT,
        categoryId: undefined,
        authorId: '',
        tags: [],
      });
      setTags([]);
      setPreview(null);
    }

    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [id, isNew]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        if (preview && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
        const objectUrl = URL.createObjectURL(file);
        setForm({ ...form, thumbnailUrl: objectUrl });
        setPreview(objectUrl);
        setPreviewError(null);
      }
    },
    [form, preview]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB limit
  });

  const handleRemoveImage = () => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setForm({ ...form, thumbnailUrl: '' });
    setPreview(null);
    setPreviewError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedTagIds = tags
      .map((tagName) => mockTags.find((t) => t.name === tagName)?.id)
      .filter((id): id is number => id !== undefined);
    const articleData = {
      ...form,
      tags: selectedTagIds.map((tagId) => ({ tagId })),
    };
    // Replace with Prisma query and file upload logic
    console.log('Saving article:', articleData);
    router.push('/articles');
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {isNew ? 'Create Article' : 'Edit Article'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title || ''}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="summary"
              className="block text-sm font-medium text-gray-700"
            >
              Summary
            </label>
            <textarea
              id="summary"
              name="summary"
              value={form.summary || ''}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
              required
            />
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Content
            </label>
            <div className="mt-1 relative resize-y min-h-[200px] max-h-[600px] border border-gray-300 rounded-lg overflow-hidden">
              <MDEditor
                value={form.content || ''}
                onChange={(value) => setForm({ ...form, content: value || '' })}
                className="min-h-[350px] h-full"
                preview="edit"
              />
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200 cursor-ns-resize hover:bg-indigo-200 transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Thumbnail Image
            </label>
            <div
              {...getRootProps()}
              className={`mt-1 border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                isDragActive
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <input {...getInputProps()} />
              <p className="text-sm text-gray-600">
                {isDragActive
                  ? 'Drop the image here'
                  : 'Drag & drop an image here, or click to select'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                (Accepted: JPG, PNG, GIF, max 5MB)
              </p>
            </div>
            {previewError && (
              <p className="mt-2 text-sm text-red-600">{previewError}</p>
            )}
            {preview && (
              <div className="mt-4 relative max-w-xs">
                <img
                  src={preview}
                  alt="Thumbnail preview"
                  className="w-full h-40 rounded-lg shadow-md object-cover animate-image-enter"
                  onError={() => {
                    setPreviewError('Failed to load image preview');
                    setPreview(null);
                    setForm({ ...form, thumbnailUrl: '' });
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={form.status || ArticleStatus.DRAFT}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={ArticleStatus.DRAFT}>Draft</option>
              <option value={ArticleStatus.PUBLISHED}>Published</option>
              <option value={ArticleStatus.ARCHIVED}>Archived</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={form.categoryId || ''}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select Category</option>
              <option value={1}>Tech</option>
              <option value={2}>Lifestyle</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700"
            >
              Tags
            </label>
            <TagsInput
              value={tags}
              onChange={handleTagsChange}
              inputProps={{
                id: 'tags',
                className:
                  'border-0 px-2 py-1 focus:outline-none focus:ring-0 w-full text-sm',
                placeholder: 'Add a tag',
              }}
              className="mt-1 react-tagsinput border border-gray-300 rounded-lg px-2 py-2 bg-white"
              onlyUnique={true}
              addOnBlur={true}
              addOnPaste={true}
              pasteSplit={(data: string) =>
                data.split(',').map((t) => t.trim())
              }
              tagProps={{
                className:
                  'react-tagsinput-tag bg-indigo-100 text-indigo-800 text-sm font-medium px-2 py-1 rounded mr-1 mb-1 animate-tag-enter',
                classNameRemove: 'react-tagsinput-remove',
              }}
            />
            <p className="text-sm text-gray-500 mt-1">
              Type a tag and press Enter or comma to add
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => router.push('/articles')}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
