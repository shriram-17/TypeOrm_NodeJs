import { FastifyInstance,FastifyRequest} from 'fastify';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';
import { UserSchema } from '../schema/Schemas';

const userRouter = (app:FastifyInstance,opts:any,done:() => void) => {
    
    app.get("/",(request,reply)=> {
     reply.send("Your in the User Route")
    })
    
    app.get('/all',async (request,reply) => {
        const users: User[] = await AppDataSource.getRepository(User).find(); 
        console.log(users);
        reply.code(500).send(users);
    });

    app.get('/name',async(request,reply)=> {
      const users : User[] = await AppDataSource.getRepository(User).find();
      const Names  = []
      users.forEach((user:User)=> {
        const sample ={
          "id":user.id,
          "name":user.firstName+" "+user.lastName
        }
        Names.push(sample);
      })
      reply.send(Names);
    })

    app.get('/:id', async (request:FastifyRequest<{Params:{id:number}}>,reply) => {
        try {
          const user = await AppDataSource.getRepository(User).findOneBy({
            id: request.params.id,
          });
      
          if (user) {
            reply.send(user);
          } else {
            reply.code(404).send({ error: 'User not found' });
          }
        } catch (error) {
          reply.code(500).send({ error: 'Internal Server Error' });
        }
      });
      
      app.post('/',async (request:FastifyRequest,reply)=>{ 
        const user  = request.body;
        console.log(user)
        console.log(UserSchema.parse(user))
        const Valid :boolean =UserSchema.safeParse(user).success; 
        if(Valid)
        {
          try
          {
          await AppDataSource.getRepository(User).save(user);
          reply.code(500).send({"Message":"User Have Been Inserted"});        
          }
          catch(err)
          {
            reply.code(400).send({"err":err});
          }
        }
        
        reply.code(400).send({"Message":"Validation Error"});
    });

    app.put("/name/:id",async (request:FastifyRequest<{Params:{id:number}}>,reply)=> {
      const { id } = request.params;
      const {name} = request.query as {name?:string}
       
      try {
        await AppDataSource.getRepository(User).update({id:id},{firstName:name})
        reply.code(500).send({"Message":"I have sent"})
      }
      catch(err)
      {
       reply.code(404).send({"err":err})
      }
    });
    
    app.get("/total/age",async (request:FastifyRequest,reply) => {
    
      const users:User[] = await AppDataSource.getRepository(User).find();
      
      console.log(users);

      const sumOfAges:number = users.reduce((total,user) => total+user.age,0);
        
      return reply.code(500).send(sumOfAges);
    });

    done();
};  

export default userRouter;  