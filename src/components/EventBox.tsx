import  { useState } from 'react'
const EventBox = ({events}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    
    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const handleImageError = () => {
        setIsLoading(false);
        setHasError(true);
    };
    return (
        <div>
            
                <div style={{ width: "100%", position: "relative" }}>
                    {isLoading && !hasError && (
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 1,
                            }}
                        >
                            <span>
                                <img
                                    src="/images/loader.svg"
                                    alt="Loading..."
                                    style={{ width: "50px", height: "50px" }}
                                />
                            </span>
                        </div>
                    )}
                    {hasError && (
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#ffe5e5",
                            }}
                        >
                            <span>Error loading image</span>
                        </div>
                    )}
                    {!hasError && (
                        <img
                            style={{
                                width: "100%",
                                height: isLoading ? "0" : "auto",
                                opacity: isLoading ? 0 : 1,
                            }}
                            src={`https://restaurantbackend.dbitsdemo.com${events[0].imageUrls[0]}`}
                            alt="Event"
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                        />
                    )}
                </div>

        </div>
    )
}

export default EventBox
