"use client";

import { FC, ReactNode, useEffect, useState } from "react";
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useConnect } from "wagmi";
import { injected } from "wagmi/connectors";



const BlueSkyHeader = () => {
  const { connect } = useConnect();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isMiniPay, setIsMiniPay] = useState(false);

  useEffect(() => {
    if (
      window.ethereum &&
      (window.ethereum.isMiniPay || window.ethereum.isMinipay)
    ) {
      setIsMiniPay(true);
      connect({ connector: injected({ target: "metaMask" }) });
    }
  }, []);

  return (
    <>
      
          
          <Flex alignItems={"center"}>
            {/* <IconButton
              _hover={{
                bgColor: "#FFD62C",
              }}
              color={"white"}
              bgColor={"white"}
              size={"md"}
              icon={
                colorMode === "light" ? (
                  <MoonIcon color={"black"} />
                ) : (
                  <SunIcon color={"black"} />
                )
              }
              aria-label={"Change Color Mode"}
              // display={{ md: "none" }}
              onClick={toggleColorMode}
              marginRight={4}
            /> */}

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


    </>
  );
};

export default BlueSkyHeader;
