import React from 'react'
import { useRef, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';



const Manager = () => {
    const ref = useRef()
    const passwordRef = useRef()
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setpasswordArray] = useState([])

    const getPasswords = async () => {
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json()
        setpasswordArray(passwords)

    }

    useEffect(() => {
        getPasswords()
    }, [])

    const copyText = (text) => {
        toast('copied to clipboard!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",

        });
        navigator.clipboard.writeText(text)
    }



    const ShowPassword = () => {
        passwordRef.current.type = "text"
        console.log(ref.current.src)
        if (ref.current.src.includes("icons/eyecross.png")) {
            ref.current.src = "icons/eye.png"
            passwordRef.current.type = "password"
        }
        else {
            passwordRef.current.type = "text"
            ref.current.src = "icons/eyecross.png"
        }
    }

    const savepass = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            // setpasswordArray([...passwordArray, { ...form, id: uuidv4() }])
            // localStorage.setItem("password", JSON.stringify([...passwordArray, { ...form, id: uuidv4() }]))
            // console.log([...passwordArray, form])

            await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: form.id }) })

            setpasswordArray([...passwordArray, { ...form, id: uuidv4() }])
            await fetch("http://localhost:3000/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id: uuidv4() }) })


            setform({ site: "", username: "", password: "" })
            toast('copied to clipboard!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",

            });
        } else {
            toast('Error: Password not saved!')
        }

    }

    const deletepass = async (id) => {
        console.log("Deleting password with id ", id)
        let c = confirm("do you want to delete?")
        if (c) {
            setpasswordArray(passwordArray.filter(item => item.id !== id))
            // localStorage.setItem("password", JSON.stringify([passwordArray.filter(item => item.id !== id)]))

            await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })

            toast('copied to clipboard!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",

            });
        }
    }
    const editPassword = (id) => {
        setform({ ...passwordArray.filter(i => i.id === id)[0], id: id })
        setpasswordArray(passwordArray.filter(item => item.id !== id))
    }

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"

            />
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div></div>

            <div className='md:mycontainer p-3 min-h[88.2vh]'>
                <h1 className='text-4xl text font-bold text-center'>
                    <span className='text-green-700'>&lt;</span>
                    <span>Pass</span>
                    <span className='text-green-700'>MG/&gt;</span>
                </h1>
                <p className='text-green-500 text-center text-lg'>This is your password manager</p>

                <div className='text-black flex p-4 flex-col gap-8 items-center'>
                    <input value={form.site} onChange={handleChange} placeholder='Enter website url' className='rounded-full border border-green-500 w-full p-4 py-1' type="text" name='site' id='site' />
                    <div className="flex flex-col md:flex-row w-full justify-between gap-8">
                        <input value={form.username} onChange={handleChange} placeholder='Enter username' className='rounded-full border border-green-500 w-full p-4 py-1' type="text" name='username' id='username' />
                        <div className='relative'>

                            <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter Password' className='rounded-full border border-green-500 w-full p-4 py-1' type="password" name='password' id='password' />
                            <span className=' absolute  right-[3px] top-[4px] cursor-pointer' onClick={ShowPassword}>
                                <img ref={ref} className='p-1' width={26} src="icons/eye.png" alt="eye" />
                            </span>
                        </div>

                    </div>
                    <button onClick={savepass} className='flex justify-center items-center bg-green-400
                         hover:bg-green-300 rounded-full px-4 py-2 w-fit'>
                        <lord-icon
                            src="https://cdn.lordicon.com/ueoydrft.json"
                            trigger="hover"
                            colors="primary:#121331,secondary:#7166ee,tertiary:#ebe6ef">
                        </lord-icon>
                        Add Password
                    </button>


                </div>
                <div className='passwords'>
                    <h2 className='font-bold py-4 text-2xl'>Your Passwords</h2>
                    {passwordArray.length === 0 && <div> No passwords to show</div>}
                    {passwordArray.length != 0 && <table className="table-auto w-full rounded-md overflow-hidden mb-10">
                        <thead className='bg-green-800 text-white'>
                            <tr>
                                <th className='py-2'>Site</th>
                                <th className='py-2'>Username</th>
                                <th className='py-2'>Password</th>
                                <th className='py-2'>Action</th>
                            </tr>
                        </thead>
                        <tbody className='bg-green-100'>
                            {passwordArray.map((item, index) => {
                                return <tr key={index}>
                                    <td className='py-2 border border-white text-center'>
                                        <div className='flex items-center justify-center'>

                                            <a href={item.site} target='_blank'><span>{item.site}</span></a>
                                            <button onClick={() => { copyText(item.site) }}
                                                className='border border-2px bg-teal-200 rounded-lg px-1'>copy</button>
                                        </div>
                                    </td>

                                    <td className='py-2 border border-white 
                                    text-center'>
                                        <div className='flex items-center justify-center'>
                                            <span>{item.username}</span>
                                            <button onClick={() => { copyText(item.username) }}
                                                className='border border-2px bg-teal-200 rounded-lg px-1'>copy</button>
                                        </div>
                                    </td>

                                    <td className='py-2 border border-white 
                                    text-center'>
                                        <div className='flex items-center justify-center'>
                                            <span>{"*".repeat(item.password.length)}</span>
                                            <button onClick={() => { copyText(item.password) }}
                                                className='border border-2px bg-teal-200 rounded-lg px-1'>copy</button>
                                        </div>
                                    </td>

                                    <td className='py-2 border items-center border-white justify-center'>
                                        <span>
                                            <button onClick={() => { editPassword(item.id) }} className='border border-2px bg-teal-200 rounded-lg px-1'> edit </button>
                                        </span>
                                        <span className='cursor-pointer mx-1' onClick={() => { deletepass(item.id) }}>
                                            <lord-icon
                                                src="https://cdn.lordicon.com/skkahier.json"
                                                trigger="hover"
                                                style={{ "width": "25px", "height": "25px " }}>
                                            </lord-icon>
                                        </span>
                                    </td>
                                </tr>
                            })}

                        </tbody>
                    </table>}
                </div>
            </div>
        </>
    )
}

export default Manager
