/*
const signupText =
  sections?.navHeader?.cta || config.ctaTextInline || 'Get started'

{
  auth.isAuthenticated ? (
    <div className={theme(styles, 'actions')}>
      {config.header?.login !== false && (
        <Link to='/logout' className={theme(styles, 'login')}>
          <CTAButton type='secondary' inline>
            Log out
          </CTAButton>
        </Link>
      )}

      {config.header?.dashboard !== false && (
        <Link to='/dashboard'>
          <CTAButton type='primary' inline>
            Dashboard
          </CTAButton>
        </Link>
      )}
    </div>
  ) : (
    <div className={theme(styles, 'actions')}>
      {config.header?.login !== false && (
        <Link to='/login' className={theme(styles, 'login')}>
          <CTAButton type='secondary' inline>
            Log in
          </CTAButton>
        </Link>
      )}

      {config.header?.signup !== false &&
        (config.ctaOnClick ? (
          <CTAButton type='primary' inline onClick={config.ctaOnClick}>
            {signupText}
          </CTAButton>
        ) : (
          <Link to={sections?.hero?.ctaLink || '/signup'}>
            <CTAButton type='primary' inline>
              {signupText}
            </CTAButton>
          </Link>
        ))}
    </div>
  )
}
*/
