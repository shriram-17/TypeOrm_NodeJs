import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

const Data = [
  { id: "1", name: "ABC" },
  { id: "2", name: "XYZ" }
];

function App() {
  
  const [data,setData] = useState([])
  
  const queryClient = new QueryClient();

  const sampleQuery = useQuery({
    queryKey:['data'],
    queryFn:async () => {
      const response = await axios.get("http://localhost:3000/users/name");
      return response.data;
    }
  });

  const newSampleMutation = useMutation({
    mutationFn : async (title: string) => {
         await wait(1000);
      const newId = (Data.length + 1) as unknown;
      Data.push({ id: newId as string, name: title });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['data']);
    }
  });

  const handleButtonClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    newSampleMutation.mutate("ABC");
  };
  

  if (sampleQuery.isLoading) {
    return <h1>Loading...</h1>
  }

  if (sampleQuery.error) {
    return <h1>Fetch error</h1>
  };

  return (
    
    <div>
      <h1>{sampleQuery.data.map((item:any)=> (<div key ={item.id}>{item.name}</div>))}</h1>
    <button  disabled={sampleQuery.isLoading} onClick={handleButtonClick}>
      Insert the user
    </button>
    
    </div>
  
  );

};

const wait = (duration: number) => {
  return new Promise(resolve => { setTimeout(resolve, duration) })
}

export default App;

