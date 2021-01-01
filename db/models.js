function User(email, hash, code, userID) {
    this.email = email
    this.hash = hash
    this.code = code 
    this.userID = userID
}

module.exports = {
	User: User
}