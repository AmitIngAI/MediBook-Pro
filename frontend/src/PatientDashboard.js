<Grid item xs={12} md={6}>
    <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
            My Profile
        </Typography>
        <Button
            variant="contained"
            onClick={() => navigate('/patient/profile')}
        >
            View Profile
        </Button>
    </Paper>
</Grid>