'use client';

import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


type SearchBoxValue = {
  query: string;
}

const SearchBox = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<SearchBoxValue>();

  const handleSearch: SubmitHandler<SearchBoxValue> = (formValue) => {
    const { query } = formValue;

    router.push(`/articles?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <form onSubmit={handleSubmit(handleSearch)}>
        <div className="relative">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="記事を検索"
            className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm ${
              errors.query ? 'border-red-400' : 'border-primary'
            }`}
            {...register('query', {
              maxLength: {
                value: 100,
                message: '100文字以内で入力してください',
              },
            })}
            aria-invalid={!!errors.query}
            aria-describedby={errors.query ? 'searchbox-error' : undefined}
          />
        </div>
        {errors.query && (
          <p id="searchbox-error" className="mt-2 text-xs text-red-500">
            {errors.query.message}
          </p>
        )}
      </form>
    </div>
  );
};

export default SearchBox;