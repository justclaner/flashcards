const Login = () => {
  return (
    <div className="p-4 flex items-center justify-center h-screen">
        <div className="p-4 border border-black rounded-xl">
            {/* <h1 className="p-2 text-3xl">Login</h1> */}
            <div className="p-2 flex flex-col">
                <label className="text-2xl">Username:</label>
                <input type="text" className="p-1 text-2xl w-full border border-black" />
            </div>
            <div className="p-2 flex flex-col">
                <label className="text-2xl">Password:</label>
                <input type="password" className="p-1 text-2xl w-full border border-black" />
            </div>
            <button className="block mx-auto my-2 px-2 py-1 text-3xl border border-black hover:bg-gray-200 active:bg-gray-100">Login</button>
        </div>
    </div>
  )
}

export default Login