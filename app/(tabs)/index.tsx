import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  Platform,
  BackHandler,
  TouchableOpacity,
  Modal,
  Share,
  Clipboard,
  Button,
  Linking,
} from "react-native";
import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import {
  WebViewNavigation,
  WebViewOpenWindowEvent,
} from "react-native-webview/lib/WebViewTypes";
import axios from "axios";

export default function App() {
  const [canGoBack, setCanGoBack] = useState<boolean>(false);
  const [currentUrl, setCurrentUrl] = useState<string>(
    // "https://api.ipify.org"
    // "https://coinmarketcap.com/currencies/zkml/"
    "https://2ip.io"
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedUrl, setSelectedUrl] = useState<string>("");

  const webViewRef = React.useRef(null);

  // const handleShouldStartLoadWithRequest = async (event) => {
  //   console.log({ event });
  //   try {
  //     const response = await axios.get(event.url);
  //     const html = response.data;

  //     // console.log("html", html);
  //     webViewRef.current?.injectJavaScript(`
  //       document.open();
  //       document.write(${JSON.stringify(html)});
  //       document.close();
  //     `);
  //     console.log("done");
  //     // Return false to prevent the WebView from loading the URL itself
  //     return false;
  //   } catch (error) {
  //     console.error("Failed to fetch through proxy:", error);
  //     // If there's an error, allow the WebView to load the URL directly
  //     return true;
  //   }
  // };

  const getHtml = async (url: string) => {
    try {
      const parsedUrl = new URL(url);
      const origin = parsedUrl.origin;
      const headers = {
        Origin: origin,
        Host: parsedUrl.host,
        Referer: origin + "/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      };
      const response = await axios.get(
        "https://a7e5dxwo2iug4evxl3wgbf3ehu.srv.us/proxy",
        {
          params: {
            url,
          },
          headers,
        }
      );
      const html = response.data;

      console.log("fetched resp for ", url);
      return html;
    } catch (error) {
      console.error("Failed to fetch through proxy:", error);
      return "";
    }
  };

  //   const handleShouldStartLoadWithRequest = (event) => {
  //     console.log("handleShouldStartLoadWithRequest called");
  //     console.log("Event:", JSON.stringify(event, null, 2));

  //     const htmlContent = `
  //     <html>
  //       <body>
  //         <h1>lovo</h1>
  //         <p>This is injected content</p>
  //         <a href="https://api.ipify.org?format=json">Porxy</a>
  //       </body>
  //     </html>
  //   `;

  //     getHtml(event.url).then((html) => {
  //       // Inject the HTML content
  //       const parsedUrl = new URL(event.url);
  //       const origin = parsedUrl.origin;
  //       setCurrentUrl("https://2ip.io");
  //       console.log("changed url", parsedUrl);
  //       webViewRef.current?.injectJavaScript(`
  //       (function() {
  //       document.open();
  //       document.write(${JSON.stringify(html)});
  //       document.close();
  //     })();
  //     true;
  //   `);
  //     });
  //     return false;
  //   };

  //   const PROXY_URL = "https://a7e5dxwo2iug4evxl3wgbf3ehu.srv.us/proxy";
  //   const injectedJavaScript = `
  //   (function() {
  //     var originalFetch = window.fetch;
  //     window.fetch = function(input, init) {
  //       if (typeof input === 'string') {
  //         input = '${PROXY_URL}?url=' + input;
  //       } else if (input instanceof Request) {
  //         input = new Request('${PROXY_URL}?url=' + input.url, input);
  //       }
  //       return originalFetch.call(this, input, init);
  //     };

  //     var originalXHR = window.XMLHttpRequest;
  //     window.XMLHttpRequest = function() {
  //       var xhr = new originalXHR();
  //       var originalOpen = xhr.open;
  //       xhr.open = function(method, url, ...rest) {
  //         url = '${PROXY_URL}?url=' + url;
  //         return originalOpen.call(this, method, url, ...rest);
  //       };
  //       return xhr;
  //     };
  //   })();
  // `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: currentUrl }}
        style={styles.webview}
        // setSupportMultipleWindows={false}
        originWhitelist={["*"]}
        onLoadStart={() => {
          // console.log(injectedJavaScript);
          console.log("onLoadStart");
        }}
        // injectedJavaScript={injectedJavaScript}
        // onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: Constants.statusBarHeight,
  },
  webview: {
    flex: 1,
  },
  button: {
    padding: 10,
    backgroundColor: "lightblue",
    alignItems: "center",
    marginBottom: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 5,
    minWidth: 100,
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#2196F3",
    marginTop: 10,
  },
});
