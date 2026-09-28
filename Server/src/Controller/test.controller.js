async function test(req, res){
    try{
        return res.status(200).json({
            message: "token verified",
            data: req.user
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        })
}
}



export {
    test
}