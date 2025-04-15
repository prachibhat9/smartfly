import React from 'react';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Link, LinkProps } from 'expo-router';

type ExternalLinkProps = Omit<LinkProps, 'href'> & {
  href: string;
};

export function ExternalLink({ href, ...rest }: ExternalLinkProps) {
  return (
    <Link
      {...rest}
      href={href}
      // `target="_blank"` is generally a web-only prop, but we'll leave it here:
      target="_blank"
      onPress={async (event) => {
        if (Platform.OS !== 'web') {
          // Prevent the default browser behavior on native.
          event.preventDefault?.();
          // Open in an in-app browser instead.
          await WebBrowser.openBrowserAsync(href);
        }
      }}
    />
  );
}
