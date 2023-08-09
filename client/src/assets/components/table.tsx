import React from 'react';
import { useQuery, useMutation, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { User } from '../../types';
import './Entry.css'; 

export function TableView()
{
    const queryclient = new QueryClient();
    
    const DataQuery = useQuery({
        queryKey:['entries'],
        queryFn: async () => {
            const response = await axios.get("http://localhost:3000/users/all");
            return response.data;
        }
    });

    return (
        <QueryClientProvider client={queryclient}>
          <div className="entry-container">
            <div className="title">Entries Table</div>
            <table className="entry-table">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Age</th>
                </tr>
              </thead>
              <tbody>
                {DataQuery.data?.map((entry: User, index: number) => (
                  <tr key={index}>
                    <td>{entry.firstName}</td>
                    <td>{entry.lastName}</td>
                    <td>{entry.age}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </QueryClientProvider>
      );
    }
