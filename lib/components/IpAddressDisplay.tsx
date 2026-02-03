import CopyLabel from "@/lib/components/CopyLabel";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/lib/components/shadcn/ui/tooltip";
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
        <Tooltip>
          <TooltipTrigger>
            <CopyLabel
              label="IPV4"
              value={ipAddress.IPV4}
              className="bg-indigo-400 hover:bg-indigo-500/90"
            />
          </TooltipTrigger>
          <TooltipContent>Click to copy IPV4 address</TooltipContent>
        </Tooltip>
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
      <div className="border-bprimary m-auto mb-2.5 h-1 max-w-10/12 border-b px-5 pb-2.5 md:max-w-[500px]"></div>
      <div>
        {ipAddress.IPV6 ? (
          <h1 className="m-auto max-w-11/12 pb-1 font-black tracking-wider wrap-anywhere text-gray-600 lg:text-lg">
            {ipAddress.IPV6}
          </h1>
        ) : (
          <div className="pb-2">{renderNotAvailableMessage()}</div>
        )}
        <Tooltip>
          <TooltipTrigger>
            <CopyLabel
              label="IPV6"
              value={ipAddress.IPV6}
              className="bg-gray-600 hover:bg-gray-700"
            />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            Click to copy IPV6 address
          </TooltipContent>
        </Tooltip>
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
