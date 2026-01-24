import { useState, FormEvent, ChangeEvent } from 'react';
import styles from '@/styles/Home.module.css';

interface CarData {
  success: boolean;
  data?: any;
  error?: string;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CarData | null>(null);
  const [active, setActive] = useState('true');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setActive(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active }),
      });

      const result: CarData = await response.json();

      if (!response.ok) {
        setError(result.error || 'Error fetching data');
        return;
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>🚗 Car API Consumer</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="active">Active Status:</label>
            <select
              id="active"
              value={active}
              onChange={handleInputChange}
              disabled={loading}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.button}
          >
            {loading ? 'Loading...' : 'Fetch Cars'}
          </button>
        </form>

        {error && (
          <div className={styles.error}>
            <p>❌ Error: {error}</p>
          </div>
        )}

        {data && (
          <div className={styles.response}>
            <h2>Response:</h2>
            <pre className={styles.pre}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}
