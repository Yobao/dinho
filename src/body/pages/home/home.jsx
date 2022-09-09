import React, { useState, useEffect, useContext } from "react";
import { OtherUserContext, DropdownTitleContext, LanguageContext } from "../../../store/user-context";
import LoadingButton from "../../../components/low-lvl-components/button-loading";

function HomePageComponent() {
  const otherUserContext = useContext(OtherUserContext);
  const dropdownTitleContext = useContext(DropdownTitleContext);
  const languageContext = useContext(LanguageContext);
  const appLanguage = languageContext.appLanguage;
  const text = appLanguage.homeTitle;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    otherUserContext[1]({ otherUserName: null, otherUserId: null });
    dropdownTitleContext[1](null);

    let timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <React.Fragment>
      {isLoading && <LoadingButton />}
      {!isLoading && (
        <div className='columns is-centered is-6 px-4 py-3 is-mobile'>
          <div className='body-page body-page column is-centered'>
            <div className='has-text-centered'>
              <h1 className='title is-3'>{text.welcome}</h1>
              <br />
              <h3 className='title is-5'>{text.info1}</h3>
              <h3 className='title is-5'>{text.info2}</h3>
              <h3 className='title is-5'>{text.info3}</h3>
              <h3 className='title is-5'>{text.info4}</h3>
              <br />

              <div className='column'>
                <iframe
                  src='https://flo.uri.sh/visualisation/10156801/embed'
                  title='Interactive or visual content'
                  className='flourish-embed-iframe'
                  frameBorder='0'
                  scrolling='no'
                  style={{
                    width: "100%",
                    height: "35em",
                  }}
                  sandbox='allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation'
                ></iframe>
              </div>

              <br />
              <br />
              <h2 className='title is-3'>{text.example}</h2>

              <figure className='image is-inline-block column'>
                <img
                  src={text.rules}
                  className=''
                  onLoad={() => setIsLoading(false)}
                  style={!isLoading ? {} : { display: "none" }}
                />
              </figure>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default HomePageComponent;
