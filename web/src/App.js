import React, { useRef } from 'react'
import { useFetch } from './hooks/useFetch'

import { Button, message, Tooltip } from 'antd'
import {CloseCircleOutlined } from '@ant-design/icons'

import { useHistory } from 'react-router';

export default function App({ location }) {
  const history = useHistory();
  const searchName = decodeURI(location.search).split("&").at(0).split("=").at(-1)
  
  const { data, error } = useFetch(location.search)
  const inputRef = useRef()
  const handleKeyDown = (e) => {
    const { value } = inputRef.current
    if (e.key === "Enter") {
      value.length > 2 ? history.push({ search: `keywords=${value}` }) : message.warning("คำค้นหาต้องมากกว่า 2 ตัวอักษร")
    }
  }
  const handleOnChange = e => {
    const { value } = e.target
    if (value.length <= 0) {
      history.push({ search: "" })
    }
  }
  const handleTagClick = tag => {
    history.push({ search: `keywords=${tag}&findBy=tags` })
  }
  const handleClearSearch = () =>{
    history.push({ search: "" })
  }

  return (
    <div className="flex flex-col w-full gap-3 px-2 py-4 m-2 mx-auto rounded-lg xl:w-3/4">
      <p className="text-center text-blue-500 duration-300 transform text-7xl hover:scale-95 hover:text-blue-400">เที่ยวไหนดี</p>
      <Tooltip title="กด Enter เมื่อต้องการค้นหา" placement="right">
        <input className="w-10/12 px-3 py-2 mx-auto mb-3 leading-tight text-center text-gray-700 transform border-b focus:border-blue-500 hover:border-blue-300 hover:scale-105 focus:scale-105 focus:outline-none focus:shadow-outline"
          placeholder={`"ชื่อสถานที่" , "คำอธิบาย" , "แท็ก"`}
          onKeyDown={handleKeyDown}
          onChange={handleOnChange}
          ref={inputRef}
          // split from parameter 
          // & --> index (0)
          // = --> index (-1)
          // BUG : ค่าไม่ยอมเปลี่ยนเวลา parameter เปลี่ยน T-T
        />
      </Tooltip>
      {error
        ? <span className="text-xl text-center text-red-900 duration-500 transform hover:text-red-600 animate-pulse">ไม่พบข้อมูล</span>
        : !data
          ? <div className="w-full p-1 text-center bg-blue-200 rounded-full animate-pulse" >กำลังโหลด...</div>
          : <div className="relative w-full h-full">
            {searchName && <div className="flex items-center w-1/2 gap-2 pl-3 text-xl text-blue-500 border-l border-blue-400">{searchName} <CloseCircleOutlined className="text-xs text-gray-700 hover:text-red-600" onClick={handleClearSearch} /></div>}
            <span className="absolute top-0 right-0 text-xs text-gray-400">ผลลัพธ์ : {data.length}</span>
            {/* show content */}
            {data.map(({title,
            eid,
            url,
            description,
            photos,
            tags, }, index) => (
            <div key={index} className={`flex flex-col w-full gap-6 ${index !== 0? "mt-10" : "mt-5"} md:flex-row md:h-72`}>
              {/* Line */}
              {index !== 0 && <div className="bg-gray-200 rounded-full my-3 w-full h-0.5 block md:hidden" />}
              {/* image */}
              <div className="w-full h-full md:w-1/3">
                <img className="object-fill w-full h-full duration-200 transform rounded hover:scale-105" src={photos[0]} alt={title} />
              </div>
              {/* content */}
              <div className="flex flex-col w-full gap-2 md:w-2/3 ">
                {/* title */}
                <span className="text-xl font-bold truncate md:h-14 ">{title}</span>
                {/* content */}
                <div >
                  <span className="text-base text-gray-500" >{description.substring(0, 150)}...</span>
                  <span className="text-blue-700"><a href={url}>อ่านต่อ</a></span>
                </div>
                {/* tag */}
                <div>
                  <span className="text-gray-500 " >หมวด : </span>
                  <span className="text-gray-700 ">
                    {tags.map((tag, index) => <span className="duration-200 transform hover:text-blue-300 hover:scale-110" key={index}
                      onClick={() => handleTagClick(tag)}>
                      {tags.length - 1 === index ? ` และ ${tag}` : `${tag} , `}
                    </span>)}
                  </span>
                </div>
                {/* image */}
                <div className="flex h-full gap-6">
                  {photos.map((photo, index) => (
                    index !== 0 &&
                    <div key={index} className="w-1/3 h-26 md:h-full">
                      <img className="object-fill w-full h-full duration-200 transform rounded hover:scale-110" src={photo} alt={title} />
                    </div>
                  ))}
                </div>
              </div>
            </div>))}
            
          </div>
      }

    </div>
  )
}
