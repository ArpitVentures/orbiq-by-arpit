import "./../Styles/AuthCard.css";

function AuthCard({
                      title,
                      subtitle,
                      children,
                      footer
                  }) {

    return (

        <div className="auth-card">

            <div className="auth-card-header">

                <h1 className="auth-logo">
                    ORB<span>IQ</span>
                </h1>

                <h2>{title}</h2>

                <p>
                    {subtitle}
                </p>

            </div>

            <div className="auth-card-body">

                {children}

            </div>

            {footer && (

                <div className="auth-card-footer">

                    {footer}

                </div>

            )}

        </div>

    );

}

export default AuthCard;