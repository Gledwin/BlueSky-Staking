"use client";

import { FC, ReactNode, useEffect, useState } from "react";
import {
  Flex,
  
  useDisclosure,
  
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useConnect } from "wagmi";
import { injected } from "wagmi/connectors";



interface Props {
  children: ReactNode;
}

const BlueSkyNavbar: FC<Props> = ({ children }) => {
  const { connect } = useConnect();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isMiniPay, setIsMiniPay] = useState(false);

  useEffect(() => {
    if (
      window.ethereum &&
      (window.ethereum.isMiniPay || window.ethereum.isMinipay)
    ) {
      setIsMiniPay(false);
      connect({ connector: injected({ target: "metaMask" }) });
    }
  }, []);

  return (
    <>
    
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          
           
          <Flex alignItems={"center"}>
            

            {!isMiniPay ? (
              <ConnectButton
                chainStatus="none"
                accountStatus={{
                  smallScreen: "avatar",
                  largeScreen: "avatar",
                }}
                showBalance={{
                  smallScreen: false,
                  largeScreen: true,
                }}
                label="Connect"
              />
            ) : (
              <div style={{ visibility: "hidden", pointerEvents: "none" }}>
                <ConnectButton
                  chainStatus="none"
                  accountStatus={{
                    smallScreen: "avatar",
                    largeScreen: "avatar",
                  }}
                  showBalance={{
                    smallScreen: false,
                    largeScreen: true,
                  }}
                  label="Connect"
                />
              </div>
            )}
          </Flex>
        </Flex>

      

      {children}
    </>
  );
};

export default BlueSkyNavbar;
