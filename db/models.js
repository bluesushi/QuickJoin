function User(email, hash, code) {
    this.email = email
    this.hash = hash
    this.code = code
}

module.exports = {
	User: User
}