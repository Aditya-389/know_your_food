import dotenv from 'dotenv';
dotenv.config();
import server from './server';

const port = process.env.PORT;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
