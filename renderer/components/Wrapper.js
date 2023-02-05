import Container from '@mui/material/Container';

const Wrapper = ({ children }) => {
    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4}}> {children} </Container>
        </>

    );
}

export default Wrapper;