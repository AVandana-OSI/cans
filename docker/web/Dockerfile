FROM cwds/cans_base_image:latest
WORKDIR /app
ADD . /app
RUN bundle install --jobs 20 --retry 5
RUN SECRET_KEY_BASE=$(echo "basesecret$(echo $RANDOM)") NODE_ENV=production RAILS_ENV=production bundle exec rails assets:precompile
RUN yarn install --production=false --non-interactive --frozen-lockfile
EXPOSE 3000 3035
CMD ["bundle", "exec", "rails", "server"]
