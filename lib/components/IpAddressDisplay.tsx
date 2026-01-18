import IpService from "@/lib/services/IpService";

interface Props {
  ipAddress: string;
}

export default async function IpAddressDisplay(props: Props) {
  const ipService = await IpService.getInstance();
  const ipAddress = ipService.parseIPAddress(props.ipAddress);

  return (
    <div>
      <div className="mb-2">
        <p className="mb-2 inline-block rounded-sm bg-indigo-400 px-2 py-0.5 text-[11px] font-bold text-white">
          IPV4
        </p>
        <p className="mb-2 text-xs font-semibold text-gray-400">
          Public IP Address
        </p>
        {ipAddress.IPV4 ? (
          <h1 className="text-4xl font-black tracking-wider text-indigo-400 md:text-4xl">
            {ipAddress.IPV4}
          </h1>
        ) : (
          <div>{renderNotAvailableMessage()}</div>
        )}
      </div>
      <div className="m-auto mb-2.5 h-1 max-w-10/12 border-b border-gray-200 px-5 pb-2.5 md:max-w-[500px]"></div>
      <div>
        {ipAddress.IPV6 ? (
          <h1 className="m-auto max-w-11/12 pb-1 font-black tracking-wider wrap-anywhere text-gray-600 lg:text-lg">
            {ipAddress.IPV6}
          </h1>
        ) : (
          <div className="pb-2">{renderNotAvailableMessage()}</div>
        )}
        <p className="inline-block rounded-sm bg-gray-600 px-2 py-0.5 text-[11px] font-bold text-white">
          IPV6
        </p>
      </div>
    </div>
  );
}

// ---

function renderNotAvailableMessage() {
  return (
    <span className="inline-block font-medium text-gray-500 italic">
      Not Available
    </span>
  );
}
