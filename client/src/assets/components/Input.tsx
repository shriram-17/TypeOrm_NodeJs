import React, { useState } from 'react';
import { useQuery, useMutation, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { User, user } from '../../types';
import './InputForm.css';

function InputForm() {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [age, setAge] = useState<number>(0);
  const [showEntries, setShowEntries] = useState<boolean>(true);

  const queryClient = new QueryClient();

  const sampleQuery = useQuery({
    queryKey: ['data'],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3000/users/name");
      return response.data;
    },
    enabled: showEntries
  });

  const newSampleMutation = useMutation<void, unknown, User>({
    mutationFn: async (user) => {
      await wait(1000);
      const message = await axios.post('http://127.0.0.1:3000/users', user);
      console.log(message);
    },
    onSuccess: () => queryClient.invalidateQueries(['data'])
  });

  const handleButtonClick: React.MouseEventHandler<HTMLButtonElement> = async () => {
    if (firstName && lastName && age) {
      const entry = {
        "firstName": firstName,
        "lastName": lastName,
        "age": age
      };
      const isValid = user.safeParse(entry).success;
      if (isValid) {
        try {
          await newSampleMutation.mutateAsync(entry);
          setFirstName("");
          setLastName("");
          setAge(0);
          setShowEntries(true);
        } catch (error) {
          console.error("Mutation failed:", error);
        }
      } else {
        alert("Invalid user data");
      }
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleShowEntriesClick = () => {
    setShowEntries(!showEntries);
  };

  const handleClearEntriesClick = () => {
    queryClient.removeQueries(['data']);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="input-container">
        <input
          className="input-field"
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          className="input-field"
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          className="input-field"
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
        />
        <button className="input-button" disabled={sampleQuery.isLoading} onClick={handleButtonClick}>
          Insert the user
        </button>

        <button className="input-button" onClick={handleShowEntriesClick}>
          {showEntries ? "Hide Entries" : "Show Entries"}
        </button>

        {sampleQuery.isLoading ? <h1>Loading...</h1> : null}
        {sampleQuery.error ? <h1>Fetch error</h1> : null}

        {sampleQuery.isSuccess && showEntries && (
          <div className="entry-list">
            {sampleQuery.data.map((item: any) => (
              <div key={item.id}>{item.name}</div>
            ))}
          </div>
        )}
      </div>
    </QueryClientProvider>
  );
}

const wait = (duration: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, duration);
  });
};

export default InputForm;
