import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { cloneElement, ReactElement } from "react";

interface IActiveLink extends LinkProps {
  children: ReactElement;
  activeClassName: string;
}

export function ActiveLink({children, activeClassName, ...rest}: IActiveLink) {
  const { asPath } = useRouter()

  const className =  asPath === rest.href ? activeClassName : ''
  
  return (
    <Link {...rest}>
      {cloneElement(children, {className})}
    </Link>
  )
}