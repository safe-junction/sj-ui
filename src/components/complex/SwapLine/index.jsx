import { IoIosArrowDown } from 'react-icons/io'

const SwapLine = ({ amount, asset, onChangeAmount = () => null }) => {
  return (
    <div className="flex flex-col items-center rounded-md overflow-hidden rounded-xl bg-gray-100 pl-4 pr-4">
      <div className="flex items-center justify-between mt-4 mb-4 ">
        <input
          className=" focus:outline-none flex-grow w-full  bg-gray-100 text-4xl text-gray-600"
          type="text"
          placeholder="0"
          value={amount}
          onChange={(_e) => onChangeAmount(_e.target.value)}
        />
        <div className="flex items-center justify-center pt-1 pb-1 pl-1 pr-2 bg-gray-200 hover:bg-gray-300 text-white rounded-3xl text-sm cursor-pointer">
          <div className="h-8 w-8">
            <div className="relative shadow-lg rounded-full h-full w-full">
              <img
                height={42}
                width={42}
                src={asset.img}
                alt="Asset icon"
                className="border border-gray-300 rounded-full h-8 w-8"
              />
              <img
                src={asset.networkImg}
                alt="Network icon"
                className="absolute top-5 left-5 border border-gray-300 rounded-full h-4 w-4"
              />
            </div>
          </div>
          <span className="text-gray-600 font-semibold ml-2 mr-2">{asset.symbol}</span>
          <IoIosArrowDown className="text-gray-600" width={24} height={24} />
        </div>
      </div>
      <div className="flex items-center justify-end mb-3 w-full">
        <span className="text-xs text-gray-600 mr-1">
          {asset.formattedBalance ? 'Balance:' : ' '} {asset.formattedBalance}
        </span>
        <span
          className="text-xs text-blue-500 font-bold mr-1 cursor-pointer"
          onClick={() => onChangeAmount(asset.balance)}
        >
          Max
        </span>
      </div>
    </div>
  )
}

export default SwapLine
